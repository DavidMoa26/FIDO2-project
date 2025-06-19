function EmailInput({ email, setEmail }) {
  return (
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}

export default EmailInput;
