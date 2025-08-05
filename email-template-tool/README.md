# Email Template Tool

A modern web-based email template management system built with Next.js, React, MUI, and PostgreSQL. This tool allows users to create, edit, manage, and export email templates with customizable headers, footers, and rich content.

## Features

- 🔐 **User Authentication** - Secure login system with JWT tokens
- 📝 **Rich Text Editor** - TinyMCE-powered editor for content creation
- 🎨 **Template Management** - Create, edit, save, and delete email templates
- 👁️ **Live Preview** - Real-time preview of email templates
- 📤 **HTML Export** - Export templates as standalone HTML files
- 🎯 **Modern UI** - Clean, responsive interface with red-themed design
- 📱 **Mobile Responsive** - Works seamlessly on all device sizes

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Material-UI (MUI)** - Component library with custom red theme
- **TinyMCE** - Rich text editor
- **TypeScript** - Type safety

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd email-template-tool
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE email_templates;
```

2. Run the database schema:
```bash
psql -d email_templates -f database/schema.sql
```

### 4. Environment Configuration

1. Copy the environment file:
```bash
cp .env.local.example .env.local
```

2. Update the `.env.local` file with your database credentials:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/email_templates
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=3001
```

### 5. TinyMCE API Key (Optional)

For the rich text editor to work with all features, you'll need a TinyMCE API key:

1. Sign up for a free account at [TinyMCE](https://www.tiny.cloud/)
2. Get your API key from the dashboard
3. Replace `"your-tinymce-api-key"` in the TemplateEditor component with your actual API key

## Running the Application

### Development Mode

1. Start the backend server:
```bash
npm run dev:server
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Start the backend server:
```bash
npm run server
```

3. Start the frontend:
```bash
npm start
```

## Default Credentials

The application comes with a default user account:
- **Username:** admin
- **Password:** password123

## Usage

### 1. Login
- Navigate to the application
- Use the default credentials or create a new account
- You'll be redirected to the dashboard upon successful login

### 2. Creating Templates
- Click "Create Template" in the header or dashboard
- Fill in the template name
- Use the rich text editors to create content for:
  - Header section (appears with red background)
  - Body content (main email content)
  - Footer section (appears with gray background)
- Click "Save Template" to store your template

### 3. Managing Templates
- View all templates in the dashboard
- **Preview** - See how your template will look
- **Edit** - Modify existing templates
- **Export** - Download templates as HTML files
- **Delete** - Remove templates permanently

### 4. Template Preview
- Use the "Show Preview" button in the editor
- Preview updates in real-time as you edit
- See exactly how your email will appear to recipients

### 5. Exporting Templates
- Click "Export HTML" on any template
- Downloads a standalone HTML file
- Ready to use in email campaigns or further customization

## Project Structure

```
email-template-tool/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Auth)
│   └── theme/              # MUI theme configuration
├── server/                 # Express.js backend
├── database/               # Database schema and migrations
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Templates
- `GET /api/templates` - Get all user templates
- `GET /api/templates/:id` - Get specific template
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `GET /api/templates/:id/export` - Export template as HTML

## UI Color Scheme

The application uses a red-themed design as specified:
- **Primary Red:** #dc2626
- **Secondary Red:** #991b1b
- **Hover Red:** #b91c1c
- **White Text:** #ffffff on red backgrounds
- **Background:** #f9fafb

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env.local`
   - Ensure database exists

2. **TinyMCE Not Loading**
   - Verify internet connection (TinyMCE loads from CDN)
   - Check API key configuration
   - Consider self-hosting TinyMCE for offline use

3. **Authentication Issues**
   - Check JWT_SECRET in environment variables
   - Clear browser localStorage and try again
   - Verify server is running on correct port

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository or contact the development team.
