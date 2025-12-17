// Password strength validation utility

export function validatePasswordStrength(password) {
  const errors = [];
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  if (!requirements.minLength) {
    errors.push("At least 8 characters");
  }
  if (!requirements.hasUpperCase) {
    errors.push("One uppercase letter");
  }
  if (!requirements.hasLowerCase) {
    errors.push("One lowercase letter");
  }
  if (!requirements.hasNumber) {
    errors.push("One number");
  }
  if (!requirements.hasSpecialChar) {
    errors.push("One special character (!@#$%^&*)");
  }

  const strength = calculatePasswordStrength(password, requirements);

  return {
    isValid: errors.length === 0,
    errors,
    requirements,
    strength, // 'weak', 'medium', 'strong'
  };
}

function calculatePasswordStrength(password, requirements) {
  const metCount = Object.values(requirements).filter(Boolean).length;
  
  if (metCount <= 2) return 'weak';
  if (metCount <= 4) return 'medium';
  return 'strong';
}

export function getPasswordStrengthColor(strength) {
  switch (strength) {
    case 'weak':
      return 'text-red-600 dark:text-red-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'strong':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export function getPasswordStrengthBg(strength) {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

