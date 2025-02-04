import signupImg from "../assets/Images/signup.webp"
import TemplateAdmin from "../components/core/Auth/TemplateAdmin"

function SignupAdmin() {
  return (
    <TemplateAdmin
      title="Join the millions learning to code with EduLearn for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  )
}

export default SignupAdmin