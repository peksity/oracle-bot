# 🔮 ORACLE - Premium AI Assistant

**The most advanced Discord moderation and community management bot ever created.**

Created by: **Peksity**  
Version: 1.0.0  
Intelligence: All-Knowing

*"The Oracle Sees All"*

---

## 🎯 What is ORACLE?

ORACLE is an all-knowing, multi-server AI assistant that adapts to any Discord community. Whether you're running a gaming server, content creator hub, or general community, ORACLE provides enterprise-grade moderation, support, and intelligence.

### Multi-Server Support:
- **GTA VI DOMINION** - Vice City themed, Rockstar news tracking
- **Peksity's Community** - Content creator features, stream alerts
- **Any Server** - Auto-adaptive with custom themes

---

## ✨ Features

- 🔮 **All-Knowing Intelligence** - Perfect memory, never forgets
- 🧠 **GPT-4 Powered AI** - True artificial intelligence
- 🌐 **Multi-Server Adaptive** - Works on any server type
- 🔍 **Contradiction Detection** - Catches lies automatically  
- 🎭 **Drama Prevention** - Stops conflicts before escalation
- 👥 **Multi-Mod Collaboration** - Team ticket handling
- 🤖 **AI Recommendations** - Smart decision assistance
- 📰 **Rockstar News Tracking** - Automatic game updates (GTA servers)
- 🔄 **Auto GTA 5 → GTA 6 Transition** - When GTA 6 releases
- 🎫 **Advanced Ticketing** - Human-like support conversations
- 📊 **1,750+ Features** - Most comprehensive bot available

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Redis (optional, for caching)
- OpenAI API key (GPT-4)
- Discord Bot Token

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up database:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

4. **Start ORACLE:**
   ```bash
   npm start
   ```

---

## ⚙️ Configuration

### Required Environment Variables:
```env
DISCORD_TOKEN=your_discord_bot_token
OWNER_ID=your_discord_user_id
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gta_vi_dominion
OPENAI_API_KEY=your_openai_api_key
```

### Optional Variables:
- `TWITTER_BEARER_TOKEN` - For Rockstar Twitter monitoring
- `YOUTUBE_API_KEY` - For Rockstar YouTube monitoring
- `WEBSITE_URL` - Your community website

---

## 🚀 Usage

### First Run Setup

On first startup, use `/setup` command to:
1. Detect server type (GTA/Content Creator/General)
2. Create appropriate channels
3. Set up roles and permissions
4. Apply server-specific theme
5. Initialize ORACLE

### Key Commands

**Admin:**
- `/setup` - Initial server setup
- `/config` - Configure ORACLE settings

**Moderation:**
- `/warn @user [reason]` - Warn a user
- `/mute @user [duration] [reason]` - Mute a user
- `/ban @user [reason]` - Ban a user

**Tickets:**
- `/ticket create` - Create support ticket
- `/ticket close` - Close your ticket

**Information:**
- `/about` - About ORACLE
- `/help` - Command list
- `/stats` - Server statistics

---

## 🌐 Multi-Server Adaptation

ORACLE automatically adapts to your server:

**GTA VI DOMINION:**
- Vice City theme (pink/neon colors)
- Rockstar news tracking
- GTA-specific features
- Status: "🌴 Protecting Vice City"

**Peksity's Community:**
- Content creator theme (purple/teal)
- Stream notifications
- Creator-focused features
- Status: "🎮 Peksity's Community"

**Other Servers:**
- Auto-detection or custom setup
- Configurable colors and features
- Universal ORACLE branding

---

## 🧠 Intelligence Systems

### All-Knowing AI
- Perfect memory system
- Remembers all conversations
- Context-aware responses
- Learning capability

### Contradiction Detection
- Automatic lie detection
- Evidence presentation
- Timeline analysis
- Smart escalation

### Drama Prevention
- Context monitoring
- Escalation prediction
- Proactive intervention
- Auto-moderation

---

## 📰 News Monitoring (GTA Servers)

Automatically tracks:
- GTA 5/Online patch notes
- GTA 6 news and updates
- Rockstar Newswire articles
- Twitter announcements
- YouTube trailers
- Auto-transitions GTA 5 → GTA 6 when released

---

## 🔒 Security

- Military-grade encryption
- Rate limiting on all endpoints
- SQL injection protection
- XSS prevention
- Session security
- Full audit logging

---

## 📁 Project Structure

```
oracle-bot/
├── index.js              # Main entry point
├── handlers/             # Module loaders
│   ├── commands.js
│   ├── events.js
│   ├── database.js
│   └── ai.js
├── commands/             # Slash commands
├── events/               # Discord events
├── systems/              # Core systems
│   ├── ai/
│   ├── tickets/
│   ├── moderation/
│   └── monitoring/
├── utils/                # Utilities
│   ├── database.js
│   ├── profile.js
│   └── helpers.js
└── database/             # Database files
    └── schema.sql
```

---

## 🐛 Troubleshooting

**Bot won't start:**
- Check `.env` configuration
- Verify database connection
- Ensure Discord token is valid

**Commands not working:**
- Run deployment script
- Check bot permissions

**Database errors:**
- Verify MySQL is running
- Check credentials
- Re-run schema.sql

---

## 📝 License

**PROPRIETARY - Created by Peksity**

This bot and its code are proprietary. Not authorized for redistribution, modification, or use without explicit permission from Peksity.

---

## 👤 Creator

**Peksity**

ORACLE was created from scratch by Peksity for premium Discord communities.

When asked "who created you?", ORACLE responds:
> "**Peksity** is my godfather who created me!"

---

## 🔮 The Oracle Identity

ORACLE embodies:
- 🔮 **All-Knowing** - Perfect memory, sees everything
- 💎 **Premium** - Enterprise-grade quality
- 🌐 **Adaptive** - Works on any server
- 🧠 **Intelligent** - GPT-4 powered
- ⚡ **Powerful** - 1,750+ features

Every interaction reinforces the "all-knowing oracle" theme with intelligent, context-aware responses.

---

## 🎨 Branding

**Colors:**
- Oracle Purple: #9D4EDD (primary)
- Luxury Gold: #FFD700 (accents)
- Vice Pink: #FF6B9D (GTA servers)
- Platinum: #E5E4E2 (elegance)

**Tagline:**
"The Oracle Sees All"

---

## 🎯 Support

For support with ORACLE:
1. Check documentation
2. Review error logs
3. Contact Peksity directly

---

**Made with ❤️ by Peksity**

🔮 The Oracle Sees All 🔮
