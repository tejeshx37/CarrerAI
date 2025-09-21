# 🤝 Contributing to CareerBridgeAI

Thank you for your interest in contributing to CareerBridgeAI! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@careerbridgeai.com](mailto:conduct@careerbridgeai.com).

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 Getting Started

### Prerequisites

- **Git** - Version control
- **Python 3.8+** - Backend development
- **Node.js 16+** - Frontend development
- **Docker** (optional) - Containerization
- **Code Editor** - VS Code, PyCharm, or similar

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CarrerAI.git
   cd CareerBridgeAI
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/tejeshx37/CarrerAI.git
   ```

## 🛠️ Development Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Run the development server
python flask_app.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

### Database Setup

```bash
# Install PostgreSQL (if using local database)
# Create database
createdb careerbridge_dev

# Run migrations (if applicable)
python manage.py migrate
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Fixes** - Fix existing issues
- **✨ New Features** - Add new functionality
- **📚 Documentation** - Improve documentation
- **🧪 Tests** - Add or improve tests
- **🎨 UI/UX** - Improve user interface
- **⚡ Performance** - Optimize performance
- **🔒 Security** - Enhance security

### Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   # Backend tests
   cd backend && python -m pytest
   
   # Frontend tests
   cd frontend && npm test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new assessment type"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 🔄 Pull Request Process

### Before Submitting

- [ ] **Tests pass** - All tests must pass
- [ ] **Code coverage** - Maintain or improve coverage
- [ ] **Documentation** - Update relevant documentation
- [ ] **Linting** - Code follows style guidelines
- [ ] **Security** - No security vulnerabilities
- [ ] **Performance** - No performance regressions

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs
2. **Code Review** - Maintainers review code
3. **Testing** - Manual testing if needed
4. **Approval** - At least one maintainer approval
5. **Merge** - Squash and merge to main

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** - Check if already reported
2. **Check documentation** - Ensure it's not documented
3. **Try latest version** - Test with latest code

### Issue Template

```markdown
## Bug Report

### Description
Clear description of the bug

### Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior
What you expected to happen

### Actual Behavior
What actually happened

### Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 2.0.0]

### Additional Context
Any other context about the problem

### Screenshots
If applicable, add screenshots
```

## 📏 Coding Standards

### Python (Backend)

```python
# Follow PEP 8
# Use type hints
def calculate_score(answers: Dict[str, Any]) -> int:
    """Calculate assessment score from answers.
    
    Args:
        answers: Dictionary of user answers
        
    Returns:
        Calculated score as integer
    """
    return sum(answers.values())

# Use meaningful variable names
user_assessment_data = get_user_data()
recommendation_engine = RecommendationEngine()

# Handle errors properly
try:
    result = process_data(data)
except ValidationError as e:
    logger.error(f"Validation failed: {e}")
    raise
```

### JavaScript (Frontend)

```javascript
// Use ES6+ features
const calculateProgress = (completed, total) => {
  return Math.round((completed / total) * 100);
};

// Use meaningful component names
const AssessmentProgress = ({ current, total }) => {
  const progress = calculateProgress(current, total);
  
  return (
    <div className="progress-container">
      <ProgressRing progress={progress} />
      <span>{current} of {total} completed</span>
    </div>
  );
};

// Handle async operations properly
const submitAssessment = async (answers) => {
  try {
    setLoading(true);
    const response = await api.submitAnswers(answers);
    setRecommendations(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### CSS/Styling

```css
/* Use BEM methodology */
.assessment-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.assessment-card__header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.assessment-card__content {
  padding: 1.5rem;
}

.assessment-card--highlighted {
  border: 2px solid #4f46e5;
}
```

## 🧪 Testing

### Backend Testing

```python
# tests/test_assessment.py
import pytest
from backend.models.assessment import Assessment

class TestAssessment:
    def test_calculate_score(self):
        assessment = Assessment()
        answers = {"q1": "A", "q2": "B"}
        score = assessment.calculate_score(answers)
        assert score == 100
    
    def test_invalid_answers(self):
        assessment = Assessment()
        with pytest.raises(ValidationError):
            assessment.calculate_score({})
```

### Frontend Testing

```javascript
// tests/Assessment.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Assessment from '../components/Assessment';

describe('Assessment Component', () => {
  test('renders assessment questions', () => {
    render(<Assessment />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  test('submits answers correctly', async () => {
    const mockSubmit = jest.fn();
    render(<Assessment onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByText('Submit'));
    expect(mockSubmit).toHaveBeenCalled();
  });
});
```

### Integration Testing

```python
# tests/test_api.py
import requests

def test_assessment_submission():
    response = requests.post(
        'http://localhost:8000/api/assessments/submit-answers',
        json={'answers': {'1': 'A'}}
    )
    assert response.status_code == 200
    assert 'recommendations' in response.json()
```

## 📚 Documentation

### Code Documentation

```python
def generate_recommendations(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate personalized career recommendations.
    
    This function analyzes user assessment data and generates
    personalized career recommendations based on their responses,
    skills, and market trends.
    
    Args:
        user_data: Dictionary containing user assessment data
            - answers: User's assessment responses
            - skills: List of user's skills
            - experience: User's experience level
            
    Returns:
        Dictionary containing:
            - career_path: Recommended career path
            - courses: List of recommended courses
            - skills_gaps: Skills to develop
            - timeline: Career development timeline
            
    Raises:
        ValidationError: If user_data is invalid
        ProcessingError: If recommendation generation fails
        
    Example:
        >>> user_data = {
        ...     'answers': {'1': 'Technology', '2': 'Remote work'},
        ...     'skills': ['Python', 'JavaScript'],
        ...     'experience': 'Entry level'
        ... }
        >>> recommendations = generate_recommendations(user_data)
        >>> print(recommendations['career_path'])
        'Software Development Career Path'
    """
    # Implementation here
    pass
```

### API Documentation

```python
@app.route('/api/assessments/submit-answers', methods=['POST'])
def submit_assessment_answers():
    """Submit assessment answers and get recommendations.
    
    ---
    tags:
      - Assessments
    parameters:
      - in: body
        name: answers
        description: User's assessment answers
        required: true
        schema:
          type: object
          properties:
            answers:
              type: object
              description: Dictionary of question IDs and answers
    responses:
      200:
        description: Assessment submitted successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: object
              properties:
                recommendations:
                  type: object
      400:
        description: Invalid input data
    """
    # Implementation here
    pass
```

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

- [ ] **Update version** in package.json and setup.py
- [ ] **Update CHANGELOG.md** with new features/fixes
- [ ] **Run full test suite** - All tests pass
- [ ] **Update documentation** - API docs, README
- [ ] **Create release notes** - Highlight key changes
- [ ] **Tag release** - Create git tag
- [ ] **Deploy** - Deploy to production


## 🏆 Recognition

Contributors are recognized in:
- **CONTRIBUTORS.md** - List of all contributors
- **Release notes** - Highlighted contributions
- **GitHub profile** - Contribution graphs
- **Annual awards** - Top contributors recognition

## 📄 License

By contributing to CareerBridgeAI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CareerBridgeAI! 🎉
