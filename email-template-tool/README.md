# Email Template Tool

A comprehensive web-based tool for creating and managing email templates with customizable headers, footers, and content blocks. Built with Next.js, React, and PostgreSQL.

## Features

- **User Authentication**: Secure login with session/token-based authentication
- **Template Management**: Create, edit, delete, and organize email templates
- **Rich Text Editor**: Full-featured WYSIWYG editor for template content
- **Template Structure**: Separate header, body, and footer sections
- **Live Preview**: Real-time preview of email templates
- **HTML Export**: Export templates as standalone HTML files
- **Red-themed UI**: Clean, modern interface with red accent colors

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT tokens with HTTP-only cookies
- **Rich Text Editor**: React Quill

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd email-template-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Create a PostgreSQL database named `email_templates`
   - Run the schema setup:
   ```bash
   psql -d email_templates -f database/schema.sql
   ```

4. **Configure environment variables**
   - Copy `.env.local` and update the database credentials:
   ```bash
   cp .env.local .env.local
   ```
   - Update the following variables:
     - `DB_HOST`: Your PostgreSQL host
     - `DB_PORT`: Your PostgreSQL port (default: 5432)
     - `DB_NAME`: Database name (default: email_templates)
     - `DB_USER`: PostgreSQL username
     - `DB_PASSWORD`: PostgreSQL password
     - `JWT_SECRET`: A secure secret key for JWT tokens

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Login

- **Username**: admin
- **Password**: admin123

## Usage

### Creating Templates

1. Click "Create Template" in the header or on the dashboard
2. Enter a template name
3. Use the rich text editors to create:
   - **Header**: Company logo, navigation, or greeting
   - **Body**: Main email content with formatting, links, and images
   - **Footer**: Contact information, unsubscribe links, etc.
4. Use "Preview Mode" to see the final email layout
5. Save the template

### Managing Templates

- **Edit**: Click "Edit" on any template card to modify content
- **Preview**: View the final email layout with "Preview"
- **Delete**: Remove templates you no longer need
- **Export**: Download templates as HTML files

### Rich Text Features

- Multiple heading levels
- Text formatting (bold, italic, underline, strikethrough)
- Text and background colors
- Ordered and unordered lists
- Text alignment options
- Links and images
- Clean formatting tools

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Templates
- `GET /api/templates` - Get all user templates
- `POST /api/templates` - Create new template
- `GET /api/templates/[id]` - Get specific template
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `created_at`
- `updated_at`

### Email Templates Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `name`
- `header_content`
- `footer_content` 
- `body_content`
- `created_at`
- `updated_at`

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use a secure `JWT_SECRET`
   - Configure production database credentials

2. **Database Setup**
   - Create production PostgreSQL database
   - Run schema setup script
   - Set up database connection pooling

3. **Security Considerations**
   - Use HTTPS in production
   - Set secure cookie flags
   - Implement rate limiting
   - Regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the repository or contact the development team.
