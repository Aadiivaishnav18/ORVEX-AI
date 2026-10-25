
export const validationData = (name, email, password) => {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    return "Please enter your name.";
  }

  if (
    !/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(
      trimmedName
    )
  ) {
    return "Please enter a valid name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
    return "Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one number.";
  }

  return null;
};
