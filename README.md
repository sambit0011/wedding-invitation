# 💍 Interactive Mobile Wedding Invitation Website

A luxury, interactive, mobile-first wedding invitation website featuring a stunning **3D Envelope Unfolding Animation** with a golden wax seal. Designed with a gorgeous champagne gold and emerald green royal color palette, it is fully optimized for iOS and Android web browsers and perfect for sharing on WhatsApp or SMS.

---

## ✨ Features

- 💌 **3D Interactive Envelope:** A fully CSS-driven 3D envelope with a realistic gold wax seal monogram. Tapping the seal automatically starts the unfolding animation, slides the card out, and opens the main website.
- 🎶 **Ambient Soundtrack:** Soft romantic piano background music playing automatically upon opening (optimized for browser autoplay restrictions). Includes a gorgeous floating spinning vinyl control button.
- ⏳ **Real-time Countdown:** Live ticking countdown timer to the wedding date to build excitement.
- 🗓️ **Interactive Day-by-Day Itinerary:** Tabbed day schedule outlining welcome events, ceremonies, and reception coordinates with timing, dress codes, and **Google Maps** integration.
- ✍️ **Tactile RSVP Form:** Fully validated response forms that save response details to local browser storage (`localStorage`) so guests' choices persist. Shows custom gold confetti success cards.
- 📱 **Mobile & iOS Friendly:** Hand-coded responsive design, touch gestures, custom safe-area offsets, and fluid typography.

---

## 🛠️ How to Test Locally on Chrome

Since this is a lightweight static web app (no complex backend compiler/bundler needed), you can run and test it on your desktop or mobile Chrome browser instantly!

### Option A: Direct Launch (Easiest)
1. Navigate to the project folder `/Users/sambitpradhan/Desktop/Wedding Invitation/`.
2. Double-click the `index.html` file to open it directly in Google Chrome.
3. To inspect mobile layout: **Right-click** anywhere on the page -> click **Inspect** (or press `Cmd+Option+I`) -> Toggle the **Device Toolbar** button in the inspector top left (looks like a phone/tablet icon) -> Select **iPhone 14** or **Samsung Galaxy S20** to view it exactly as a mobile screen.

### Option B: Using a Simple Local Server
To test background music streaming and absolute paths accurately:
1. Open terminal and run:
   ```bash
   cd "/Users/sambitpradhan/Desktop/Wedding Invitation"
   python3 -m http.server 8000
   ```
2. Open Chrome and type: `http://localhost:8000`.

---

## 🚀 How to Load / Deploy on GitHub Pages (Free Hosting)

To share this link with guests and load it directly on your mobile device, you can publish it to GitHub Pages for free in 2 minutes:

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in.
2. Click the **New** repository button in the top right.
3. Set **Repository name** to `wedding-invitation` (or any name you like).
4. Select **Public** (required for free GitHub Pages).
5. Do **NOT** initialize with a README, gitignore, or license (we already have them!).
6. Click **Create repository**.

### Step 2: Push your local code to GitHub
Run the following commands in your computer terminal:
```bash
# Navigate to the folder (if not already there)
cd "/Users/sambitpradhan/Desktop/Wedding Invitation"

# Add all files to the staging area
git add .

# Commit files
git commit -m "Initial commit: Luxury mobile wedding invitation website"

# Link your local folder to your newly created GitHub repository
# (Replace USERNAME with your actual GitHub username)
git remote add origin https://github.com/USERNAME/wedding-invitation.git

# Set your main branch
git branch -M main

# Push the code to GitHub
git push -u origin main
```

### Step 3: Turn on GitHub Pages (Free Public Link!)
1. In your GitHub repository webpage, click on the **Settings** tab (the gear icon on the top menu).
2. On the left sidebar under *Code and automation*, click **Pages**.
3. Under *Build and deployment* -> *Source*, select **Deploy from a branch**.
4. Under *Branch*, click the dropdown, choose **main** (and `/root` folder), and click **Save**.
5. Wait ~30 seconds and refresh. You will see a box at the top saying:
   > **Your site is live at `https://USERNAME.github.io/wedding-invitation/`**
6. Open that link on your iPhone or Android Chrome/Safari to enjoy the premium mobile wedding invitation!

---

## 🎨 Personalizing Details
To change the wedding text, couples' names, images, or music track:
* **Names & Dates:** Edit the text strings inside `index.html` (e.g. search for `Aarav` or `Meera`).
* **Itinerary Events:** Edit the cards within the `<div class="itinerary-panel">` blocks in `index.html`.
* **Background Music:** Swap the URL in the `<audio>` tag inside `index.html` with your own `.mp3` link.
* **Colors:** Customize colors inside `:root` variables in `style.css` (e.g. swap `--emerald-deep` for a classic velvet red `#58111A` or royal navy `#0B1B3D`).
