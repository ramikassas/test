# OpenDotDB 🌐

An open-source, free alternative to dotDB.com - A comprehensive domain research and analytics platform.

## ✨ Features

- 🔍 **Advanced Domain Search** - Search across millions of registered domains
- 📊 **Keyword Analytics** - Analyze domain keywords with trends and statistics
- 📈 **Domain Trends** - Track domain registration trends over time
- 🔔 **Domain Monitoring** - Monitor domains and get alerts on changes
- 🧩 **Domain Parser** - Break down domain names into meaningful components
- 💼 **Portfolio Management** - Manage your domain portfolio
- 🚀 **High Performance** - Optimized for speed with efficient indexing
- 🆓 **100% Free** - No paid tiers, completely open source

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with full-text search
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Shadcn/ui patterns
- **Charts**: Recharts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/opendotdb.git
cd opendotdb

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up the database
npm run db:push
npm run db:generate

# Seed sample data (optional)
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
opendotdb/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── search/       # Search page
│   │   ├── trends/       # Trends page
│   │   ├── monitor/      # Monitoring page
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/opendotdb"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## 📖 API Documentation

### Search Domains
```
GET /api/domains/search?q=keyword&tld=.com&limit=100
```

### Get Keyword Analytics
```
GET /api/analytics/keyword?keyword=example
```

### Get Trends
```
GET /api/trends?keyword=example&period=30d
```

### Monitor Domain
```
POST /api/monitor
Body: { "domain": "example.com" }
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by dotDB.com
- Built with modern web technologies
- Community-driven and open source

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by the open-source community
