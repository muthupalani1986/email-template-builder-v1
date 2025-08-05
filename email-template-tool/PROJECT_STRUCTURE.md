# Project Structure

```
email-template-tool/
├── database/
│   └── schema.sql                 # PostgreSQL database schema
├── lib/
│   ├── auth.ts                   # Authentication utilities (JWT, password hashing)
│   └── db.ts                     # Database connection configuration
├── scripts/
│   └── setup.sh                 # Automated setup script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts     # Login API endpoint
│   │   │   │   ├── logout/route.ts    # Logout API endpoint
│   │   │   │   └── me/route.ts        # Current user API endpoint
│   │   │   └── templates/
│   │   │       ├── route.ts           # Templates CRUD API (GET, POST)
│   │   │       └── [id]/route.ts      # Individual template API (GET, PUT, DELETE)
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── templates/
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create new template page
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Edit template page
│   │   │       └── preview/
│   │   │           └── page.tsx      # Template preview page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout with AuthProvider
│   │   └── page.tsx                  # Dashboard/home page
│   ├── components/
│   │   ├── Header.tsx                # Navigation header component
│   │   └── TemplateEditor.tsx        # Rich text template editor
│   └── contexts/
│       └── AuthContext.tsx           # Authentication context provider
├── .env.local                        # Environment variables
├── README.md                         # Project documentation
├── PROJECT_STRUCTURE.md              # This file
├── package.json                      # Dependencies and scripts
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── next.config.js                    # Next.js configuration
```

## Key Components

### Authentication System
- **AuthContext**: Manages user state across the application
- **JWT Tokens**: Secure authentication with HTTP-only cookies
- **Protected Routes**: Automatic redirection for unauthenticated users

### Database Layer
- **PostgreSQL Schema**: Users and email_templates tables with proper relationships
- **Connection Pooling**: Efficient database connections using pg Pool
- **SQL Queries**: Parameterized queries for security

### Template Management
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Rich Text Editor**: React Quill integration for formatted content
- **Preview System**: Live preview of email templates
- **HTML Export**: Download templates as standalone HTML files

### UI/UX Features
- **Red Theme**: Consistent red background for header and buttons
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Loading States**: User feedback during async operations
- **Error Handling**: Graceful error messages and fallbacks

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user information

### Templates
- `GET /api/templates` - List user's templates
- `POST /api/templates` - Create new template
- `GET /api/templates/[id]` - Get specific template
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for token storage
- SQL injection protection with parameterized queries
- User-specific data isolation
- CSRF protection through SameSite cookies

## Development Workflow

1. **Setup**: Run `./scripts/setup.sh` for automated setup
2. **Development**: `npm run dev` for local development server
3. **Building**: `npm run build` for production build
4. **Database**: PostgreSQL with connection pooling
5. **Styling**: Tailwind CSS for responsive design