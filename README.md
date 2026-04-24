# 华文口试练习 | Chinese Oral Exam Practice App

A comprehensive web-based application for Primary School students to practice Chinese oral examinations (PSLE preparation). Features AI-powered question generation and evaluation based on MOE Singapore curriculum standards.

## 🌟 Features

### Two Question Types
1. **朗读短文 (Reading Aloud)**
   - AI-generated passages appropriate for each grade level
   - Tests pronunciation, intonation, fluency, and accuracy

2. **看图说话 (Picture Description)**
   - Dynamic image-based questions
   - Tests content, vocabulary, pronunciation, and expression

### AI-Powered Evaluation
- Automatic grading based on MOE standards
- Detailed feedback in Chinese
- Scores out of 100 with breakdown by criteria
- Personalized improvement suggestions

### Grade Levels
- Primary 3 (P3)
- Primary 4 (P4)
- Primary 5 (P5)
- Primary 6 (P6) - PSLE Level

## 🚀 Deployment to GitHub Pages (FREE)

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name your repository (e.g., `chinese-oral-practice`)
4. Make it **Public**
5. Click **"Create repository"**

### Step 2: Upload the File

**Option A: Using GitHub Web Interface**
1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop the `index.html` file
3. Click **"Commit changes"**

**Option B: Using Git Command Line**
```bash
git clone https://github.com/YOUR-USERNAME/chinese-oral-practice.git
cd chinese-oral-practice
# Copy the index.html file here
git add index.html
git commit -m "Add Chinese oral practice app"
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository settings
2. Click **"Pages"** in the left sidebar
3. Under **"Source"**, select **"Deploy from a branch"**
4. Select **"main"** branch and **"/ (root)"** folder
5. Click **"Save"**

### Step 4: Access Your App

After a few minutes, your app will be live at:
```
https://YOUR-USERNAME.github.io/chinese-oral-practice/
```

## 💰 Cost Analysis

### Completely FREE Components:
- ✅ GitHub Pages hosting (free forever)
- ✅ Web Speech API for voice recording (browser built-in)
- ✅ Unsplash images (free tier)

### AI Features (Anthropic API):
The app uses Anthropic's Claude API for:
- Question generation
- Speech evaluation

**Estimated Costs:**
- Question generation: ~500 tokens per question (~$0.0015 per question)
- Evaluation: ~1000 tokens per evaluation (~$0.003 per evaluation)
- **Total per practice session: ~$0.0045** (less than half a cent!)

**For 100 practice sessions/month:**
- Cost: ~$0.45/month
- Well within Anthropic's free tier credits for new accounts

### How to Get Anthropic API Access:

1. **Sign up for Anthropic Console**: https://console.anthropic.com
2. **Get API credits**: New accounts often receive free credits
3. **Get your API key**: Create an API key in the console
4. **Update the code**: The current version uses client-side API calls (works but exposes your key)

### 🔒 Securing Your API Key (Recommended for Production)

For production use, you should use a backend server to protect your API key:

**Option 1: Use Netlify Functions (FREE tier available)**
**Option 2: Use Cloudflare Workers (FREE tier available)**
**Option 3: Use Vercel Serverless Functions (FREE tier available)**

See the "Advanced Deployment" section below for details.

## 📱 Usage Instructions

### For Students:

1. **Select Grade Level**
   - Choose your current grade (P3-P6)

2. **Choose Question Type**
   - Reading Aloud (朗读短文)
   - Picture Description (看图说话)

3. **Practice**
   - Click "Start Recording" when ready
   - Speak clearly into your microphone
   - Click "Stop Recording" when finished

4. **Get Feedback**
   - Click "Submit for Grading"
   - Wait for AI evaluation
   - Review your score and feedback

5. **Try Again**
   - Click "New Question" to practice more

### For Parents/Teachers:

- The app provides detailed feedback on:
  - Pronunciation (发音)
  - Intonation (语调)
  - Fluency (流畅度)
  - Accuracy (准确度)
  - Content (内容)
  - Vocabulary (词汇)
  - Expression (表达)

- Use the feedback to identify areas needing improvement
- Practice regularly for best results

## 🛠️ Technical Details

### Technologies Used:
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI**: Anthropic Claude API (Sonnet 4)
- **Speech Recognition**: Web Speech API (browser built-in)
- **Media Recording**: MediaRecorder API (browser built-in)
- **Hosting**: GitHub Pages (static hosting)

### Browser Requirements:
- Modern browser with microphone support
- Chrome, Edge, or Safari recommended
- Microphone permissions required

### Browser Compatibility:
- ✅ Chrome/Edge (best support)
- ✅ Safari (good support)
- ⚠️ Firefox (limited speech recognition)

## 🔧 Advanced Deployment with Backend (Optional)

To secure your API key, create a simple backend:

### Using Netlify Functions:

1. Create `netlify/functions/generate-question.js`:
```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { grade, type } = JSON.parse(event.body);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: /* your prompt */ }]
    })
  });
  
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
```

2. Deploy to Netlify
3. Add `ANTHROPIC_API_KEY` in Netlify environment variables
4. Update frontend to call `/api/generate-question` instead of direct API

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

MIT License - Free to use and modify

## 🎓 Educational Use

This app is designed for educational purposes to help students prepare for PSLE Chinese oral examinations. It complements but does not replace professional teaching and practice with real examiners.

## ⚠️ Important Notes

1. **Internet Connection Required**: App needs internet for AI features
2. **Microphone Access**: Allow microphone permissions when prompted
3. **Browser Support**: Works best in Chrome/Edge
4. **API Costs**: Monitor your Anthropic API usage
5. **Accuracy**: AI evaluation is a practice tool, not official grading

## 📞 Support

For issues or questions:
- Check browser console for errors
- Ensure microphone permissions are granted
- Verify internet connection
- Check Anthropic API key is valid

## 🎯 Future Enhancements

Potential improvements:
- Offline mode with pre-generated questions
- Progress tracking and history
- Comparison with previous attempts
- Multiple user profiles
- Export evaluation reports
- Parent/teacher dashboard

---

Made with ❤️ for Singapore students preparing for PSLE Chinese oral examinations
