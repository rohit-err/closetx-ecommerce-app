import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {

  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="flex flex-col justify-center md:flex-row gap-10 my-10 mb-28">
        <img
          src={assets.contact_img}
          alt=""
          className="w-full md:max-w-[480px]"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Office</p>
          <p className="text-gray-500">
            21B Fashion Street, Mumbai, Maharashtra 400001
          </p>

          <p className="text-gray-500">
            Tel: +91 98765 43210 <br /> Email: support@closetx.com
          </p>
          <p className="font-semibold text-xl text-gray-600">Work with ClosetX</p>
          <p className="text-gray-500">
            We’re building the future of sustainable fashion.
            Join our team and make a difference!
          </p>

          <button
            className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white  transition-all duration-500 "

          >
            Explore Jobs
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;