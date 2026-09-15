# Quick Start Guide - Run the Agentic AI Platform Frontend

## 📍 Where to Run Commands

All commands should be run in this directory:
```
D:\Agentic AI Project\Agentic-AI-Project\frontend
```

**This is the root folder of the frontend project where `package.json` is located.**

---

## ⚡ Quick Start (5 minutes)

### Step 1: Open Terminal/Command Prompt

Navigate to the frontend folder. Choose your method:

#### Option A: Using Windows Command Prompt
```
1. Press Win + R
2. Type: cmd
3. Navigate to the frontend folder:
   cd D:\Agentic AI Project\Agentic-AI-Project\frontend
```

#### Option B: Using PowerShell
```
1. Press Win + X
2. Select "Windows PowerShell (Admin)"
3. Navigate to the frontend folder:
   cd "D:\Agentic AI Project\Agentic-AI-Project\frontend"
```

#### Option C: Using VS Code Terminal
```
1. Open VS Code
2. File → Open Folder
3. Select: D:\Agentic AI Project\Agentic-AI-Project\frontend
4. Press Ctrl + ` to open terminal
5. Terminal is already at the right location
```

---

### Step 2: Install Dependencies

**Run this command ONCE:**

```bash
npm install
```

This will:
- Download all required packages (~500MB)
- Create `node_modules` folder
- Take 2-5 minutes depending on your internet

**You'll see:**
```
added 300+ packages in 3m
```

---

### Step 3: Start the Development Server

**Run this command to start:**

```bash
npm run local
```

You'll see:
```
  ➜  Local:   http://localhost:3001/
  ➜  press h to show help
```

---

### Step 4: Open in Browser

Open your browser and go to:
```
http://localhost:3001/
```

**You should see the Login Page!** ✅

---

## 🔐 Test the Login

Use these credentials:
```
Email:    demo@bank.example
Password: password123
```

After login, you'll see the **Dashboard** with:
- 4 KPI cards
- 7-day run outcomes chart
- Evidence sources
- Attention queue
- Recent runs

---

## 📁 Folder Structure Reminder

```
D:\Agentic AI Project\
└── Agentic-AI-Project\
    └── frontend/                    ← RUN COMMANDS HERE
        ├── src/                     (React code)
        ├── package.json             (Dependencies list)
        ├── vite.config.js           (Build config)
        ├── tsconfig.json            (TypeScript config)
        ├── .env                     (Environment variables)
        └── SETUP.md                 (Detailed setup guide)
```

---

## 🛑 Stopping the Server

In the terminal where the server is running:
```
Press Ctrl + C
```

This stops the development server. To start again, run `npm run local` again.

---

## 📝 Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies (run once) |
| `npm run local` | Start dev server on http://localhost:3001 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm test` | Run tests |
| `npm test -- --watch` | Run tests in watch mode |

---

## ✅ Checklist

- [ ] Navigated to `D:\Agentic AI Project\Agentic-AI-Project\frontend`
- [ ] Ran `npm install` (completed successfully)
- [ ] Ran `npm run local` (server started on port 3001)
- [ ] Opened `http://localhost:3001/` in browser
- [ ] See login page
- [ ] Login with demo@bank.example / password123
- [ ] See dashboard with mock data

---

## 🆘 Troubleshooting

### Issue: "npm: command not found"

**Solution:** Node.js not installed
1. Download from https://nodejs.org/ (v18 or higher)
2. Install it
3. Restart command prompt
4. Try `npm --version`

### Issue: "Port 3001 already in use"

**Solution:** Another app is using port 3001
```bash
# Find process using port 3001 (Windows)
netstat -ano | findstr :3001

# Kill it (replace PID with number from above)
taskkill /PID <PID> /F

# Then try npm run local again
```

### Issue: "Cannot find module"

**Solution:** Dependencies not installed properly
```bash
# Delete and reinstall
rm -r node_modules
rm package-lock.json
npm install
npm run local
```

### Issue: "ERR! code ERESOLVE"

**Solution:** Dependency conflict
```bash
npm install --legacy-peer-deps
npm run local
```

### Issue: Blank page in browser

**Solution:** Hard refresh browser cache
```
Press Ctrl + Shift + R (Windows/Linux)
Press Cmd + Shift + R (Mac)
```

---

## 📚 Next Steps After Running

1. **Login page is working** ✅
   - Test form validation (type invalid email)
   - Test SSO button
   - Test login with mock credentials

2. **Dashboard is working** ✅
   - View mock data (KPIs, chart, sources, queue, runs)
   - Test logout button

3. **Ready for Stage 3**
   - Extract components into smaller, reusable pieces
   - Refine UI to match design spec

---

## 🎯 You're All Set!

The development server is running and you can see:
- ✅ Login page with working form validation
- ✅ Dashboard with full mock data
- ✅ Redux state management
- ✅ Error boundaries
- ✅ Session management

Everything is ready for the next development phase! 🚀

For more detailed information, see:
- `SETUP.md` - Comprehensive setup guide
- `FRONTEND_RULES.md` - Coding standards
- `_plans/implementation-roadmap.md` - Project roadmap
