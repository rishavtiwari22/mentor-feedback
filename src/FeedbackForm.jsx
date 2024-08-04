
// src/MentorReportForm.js
import { useState } from 'react';
import './MentorReportForm.css'; // Import the CSS file
import { GoogleGenerativeAI } from "@google/generative-ai";

const MentorReportForm = () => {
  const [menteeEmail, setMenteeEmail] = useState('');
  const [dateOfReport, setDateOfReport] = useState('');
  const [mentorEmail, setmentorEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [bestPerformance, setBestPerformance] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate form fields
    if (!menteeEmail || !dateOfReport || !mentorEmail || !feedback || !bestPerformance || !suggestions) {
      setError('Please fill in all fields.');
      return;
    }

    const formData = {
      menteeEmail,
      dateOfReport,
      mentorEmail,
      feedback,
      bestPerformance,
      suggestions,
    };
    console.log('Form data:', formData);

    // Analyze the data
    const genAI = new GoogleGenerativeAI("AIzaSyDD6Tf5lWYn0ePYNgYU0R5bSi9vmDNbjL4");

    async function analyzeData() {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        
      
        const prompt = `Mentee Name: ${menteeEmail} 
          Date of Report: ${dateOfReport} 
          Mentor Name: ${mentorEmail} 
          Feedback: ${feedback} 
          Best Performance: ${bestPerformance} 
          Suggestions for Improvement: ${suggestions}
          Please provide a detailed summary of this report. Highlight key points in a "glow and grow" format also without using and bold text, where "glow" refers to the mentee's best performances and "grow" pertains to suggestions for improvement. 
          Write the summary as if the mentor is speaking in the first person, addressing the mentee in the second person. Use the mentee's and mentor's name instead of their email in the feedback section. 
          The summary should include:
          1. The mentor's feedback.
          2. A highlight of the mentee's achievements over the past week.
          3. Constructive suggestions for improvement based on the feedback provided.
          4. Recommendations for free online resources without bold text with links that can help the mentee improve in the areas mentioned in the suggestions.
          5. Make sure you are not using any bold formatting in the text and din't use any * in the text.
          6. Make it more goodlooking it should look like profetional emailbody makesure dont use any star (*) for making bold text.

          Finally, conclude the summary with encouraging lines to support the mentee and foster a positive outlook. Ensure that the text is clear and supportive, without any bold formatting.`;


        const result = await model.generateContent(prompt);
        const response  = await result.response;
        let summary = response.text();
        console.log(summary);

      
    
      // Send data to Google Sheets
      const sheetResponse = await fetch('https://script.google.com/macros/s/AKfycbxffvehs538MFcC6PlnJ9uHOn9L4b3QNxDzH2J5RIpRCdO4M_j8XTEP3N4VQqnXyJCA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menteeEmail,
          dateOfReport,
          mentorEmail,
          summary,
        }),
      });
  
      if (!sheetResponse.ok) {
        alert('Report submitted successfully!');
        throw new Error('Network response was not ok');
      }
  
      const data = await sheetResponse.json();
      console.log('Response from Google Sheets:', data);



      


    //Reset form fields after submission
      setMenteeEmail('');
      setDateOfReport('');
      setmentorEmail('');
      setFeedback('');
      setBestPerformance('');
      setSuggestions('');
  }
  analyzeData();    
};

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Mentee Weekly Progress Report</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-grid">
          <div className="form-group">
            <label>Mentee Email:</label>
            <input type="text" value={menteeEmail} onChange={(e) => setMenteeEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Date of Report:</label>
            <input type="date" value={dateOfReport} onChange={(e) => setDateOfReport(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mentor Email:</label>
            <input type="text" value={mentorEmail} onChange={(e) => setmentorEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Feedback:</label>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Best Performance:</label>
            <textarea value={bestPerformance} onChange={(e) => setBestPerformance(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Suggestions for Improvement:</label>
            <textarea value={suggestions} onChange={(e) => setSuggestions(e.target.value)} required />
          </div>
        </div>
        <div className='btn'>
          <button type="submit">Submit Report</button>
          <a href="https://docs.google.com/spreadsheets/d/1aIZFuS3woFXjWfnl24_LMYJyET--uJCBVJ8y-bEq3Ig/edit?gid=0#gid=0" target="_blank" rel="noopener noreferrer">
            <button type="button">Open Sheet ( Admin only )</button>
          </a>
          <p className='copyright'>powered by @Rishav Tiwari</p>
        </div>
        
      </form>
    </div>
  );
};

export default MentorReportForm;
