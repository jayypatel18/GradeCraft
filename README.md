# GradeCraft - Grade Calculator

A web application designed to help ITNU students calculate the grades they need for their exams. This tool allows students to input their current scores and determine what marks they need to achieve their desired grades.

## Technologies Used

- Next.js 14.x
- React 18.x
- MongoDB
- Tailwind CSS 3.x
- NextAuth.js for authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or newer)
- npm, yarn, pnpm, or bun
- Git

## Getting Started

### Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/jayypatel18/grade-calculator.git
cd grade-calculator
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Project Structure

- `/components` - React components used throughout the application
- `/models` - MongoDB models for users and results
- `/pages` - Next.js pages and API routes
- `/public` - Static assets
- `/styles` - CSS styles
- `/utils` - Utility functions

## Contributing

We welcome contributions from the community! Here's how you can contribute:

### Fork and Pull Request Workflow

1. **Fork the repository**
   - Navigate to the [repository](https://github.com/jayypatel18/grade-calculator) on GitHub
   - Click the "Fork" button in the top-right corner
   - This creates a copy of the repository in your GitHub account

2. **Clone your forked repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/grade-calculator.git
   cd grade-calculator
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Implement your feature or bug fix
   - Write or update tests if necessary
   - Ensure your code follows the project's style guidelines

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add a descriptive commit message"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Pull request"
   - Select your branch and submit the PR with a clear description of the changes

8. **Code Review**
   - Wait for maintainers to review your PR
   - Make any requested changes
   - Once approved, your PR will be merged

### Suggesting Changes

If you're not comfortable with the fork and PR workflow, you can suggest changes via:
- Opening an issue on GitHub
- Filling out the [Suggest Changes form](https://forms.gle/hxUvxGATwJZjdttq7)

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **Current Version**: 1.0.0
- **Release Date**: May 2025

### Version History

- 1.0.0 (May 2025) - Initial Release

## Deployment

The application is deployed on Vercel. For deployment instructions:

1. Fork the repository and make your changes
2. Create a Vercel account at [vercel.com](https://vercel.com)
3. Connect your GitHub account and import the repository
4. Configure environment variables
5. Deploy

## Contact

- Developer: Jay Patel
- Email: 22bce251@nirmauni.ac.in
- GitHub: [jayypatel18](https://github.com/jayypatel18)

## License

This project is licensed under the MIT License.
