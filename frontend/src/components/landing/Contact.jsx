import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";
import { useState } from "react";
import { submitContactMessage } from "../../lib/api"; // adjust the path if needed
export default function Contact() {

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  message: "",
});

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    await submitContactMessage(formData);

    alert("Thank you! Your message has been sent successfully.");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  } catch (error) {
    console.error(error);
    alert("Failed to send message.");
  } finally {
    setLoading(false);
  }
};

  return (
    <section
      id="contact"
      className="contact-section py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <div className="text-center mb-16">

          <span className="text-[#C97A00] font-semibold uppercase tracking-[0.25em]">
            CONTACT
          </span>

          <h2 className="contact-heading font-display text-3xl md:text-4xl lg:text-5xl mt-4 text-gray-900">
            Let's Build Better Hiring Together
          </h2>

          <p className="contact-text mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions about our AI Interview Platform?
            We'd love to hear from you.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left */}

          <div className="space-y-8">

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] flex items-center justify-center">
                <Mail className="text-[#F4A321]" />
              </div>

              <div>

                <h3 className="contact-heading font-semibold text-xl">
                  Email
                </h3>

                <p className="contact-text text-gray-600">
                  admin@shnoor.com
                </p>

              </div>

            </div>

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-2xl bg-[#EEF7FF] flex items-center justify-center">
                <Phone className="text-[#0E4B8E]" />
              </div>

              <div>

                <h3 className="contact-heading font-semibold text-xl">
                  Phone
                </h3>

                <p className="contact-text text-gray-600">
                  +91- 9041914601(IN)
                </p>

              </div>

            </div>

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] flex items-center justify-center">
                <MapPin className="text-[#F4A321]" />
              </div>

              <div>

                <h3 className="contact-heading font-semibold text-xl">
                  Office
                </h3>

                <p className="contact-text text-gray-600">
                  SHNOOR International LLC
                </p>

              </div>

            </div>

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-2xl bg-[#EEF7FF] flex items-center justify-center">
                <Clock className="text-[#0E4B8E]" />
              </div>

              <div>

                <h3 className="contact-heading font-semibold text-xl">
                  Working Hours
                </h3>

                <p className="contact-text text-gray-600">
                  Monday - Friday
                  <br />
                  10:00 AM - 7:00 PM
                </p>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="contact-form-card  bg-[#F8FAFC] rounded-3xl border border-gray-200 p-6 md:p-8 lg:p-10">

            <h3 className="contact-heading font-display text-3xl text-gray-900 mb-8">
              Send us a Message
            </h3>

            <form
             onSubmit={handleSubmit}
             className="space-y-6">
            

              <input
                disabled={loading}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="contact-input w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-[#0E4B8E]"
                required
              />
           
              <input
                disabled={loading}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="contact-input w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-[#0E4B8E]"
                required
              />
              
              <textarea
                disabled={loading}
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="contact-input w-full border border-gray-300 rounded-xl px-5 py-4 outline-none resize-none focus:border-[#0E4B8E]"
                required
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0E4B8E] hover:bg-[#08386d] text-white px-8 py-4 rounded-xl flex justify-center items-center gap-3 font-semibold transition-colors duration-300"
              >

                <Send size={18} />

               {loading ? "Sending..." : "Send Message"}

              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}