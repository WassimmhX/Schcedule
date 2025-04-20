import { Calendar, BookOpen, Users, ArrowRight, Facebook, Twitter, Linkedin, Mail, Phone, MapPin, LogIn } from 'lucide-react';
import bgImage from "../assets/CSWMDNJbDZvpQPAQozGF.png"
import axios from 'axios';
import { useEffect} from 'react';
const Home = () => {
  const user = localStorage.getItem('user');
  const getList=async(value)=>{
    try {
        const res = await axios.post('http://127.0.0.1:5000/getData', {
          name:value
        });
        return(res.data.message);
      } catch (error) {
        console.error('Error calling Python function', error);
        return [];
      };
  }
  useEffect(() => {
    const fetchData=async()=>{
      localStorage.setItem('rooms',JSON.stringify(await getList("rooms")));
      localStorage.setItem('teachers',JSON.stringify(await getList("teachers")));
      localStorage.setItem('classes',JSON.stringify(await getList("classes")));
    }
    fetchData();
  }, []);
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-cover bg-center flex items-center justify-center text-center text-white" style={{ backgroundImage: `url(${bgImage})` }}      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="relative z-10 max-w-4xl mx-auto p-8 leading-tight animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold  text-blue-300">
            Welcome to Our University
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-blue-100">
            Empowering minds, shaping futures, and fostering innovation for tomorrow{"'"}s leaders.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <></>
            ) : (<a href="/login" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              Login Now
              <LogIn className="ml-2 h-5 w-5" />
            </a>)}
            <a href={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role == 'admin' ? '/schedules/students' : "/schedules/schedule/"+JSON.parse(localStorage.getItem('user')).role+'s' : "/permission-denied"} 
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-7 rounded-lg transition-all">
              Explore Schedules
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Shaping Tomorrow&apos;s Leaders
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our university stands as a beacon of academic excellence, fostering innovation and critical thinking. We provide a diverse and inclusive learning environment that prepares students for the challenges of an ever-evolving world.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Diverse Community</h3>
              <p className="text-gray-600">Students from over 100 countries</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Faculty</h3>
              <p className="text-gray-600">World-renowned professors and researchers</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Rich History</h3>
              <p className="text-gray-600">Over 50 years of academic excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">
            Our Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Computer Science",
                description: "Explore cutting-edge technology and innovation in our comprehensive computer science program.",
                icon: "💻"
              },
              {
                title: "Engineering",
                description: "Build the future with hands-on experience in various engineering disciplines.",
                icon: "⚡"
              },
              {
                title: "Business Administration",
                description: "Develop leadership skills and business acumen for the modern corporate world.",
                icon: "📊"
              }
            ].map((program, index) => (
              <div key={index} className="group relative overflow-hidden">
                <div className="p-8 bg-white rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="text-4xl mb-4">{program.icon}</div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{program.title}</h3>
                  <p className="text-gray-600 mb-6">{program.description}</p>
                  <a href={`/programs/${program.title.toLowerCase().replace(" ", "-")}`} 
                     className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI Conference 2025", date: "March 10, 2025", type: "Conference" },
              { title: "Open Day", date: "April 5, 2025", type: "Campus Event" },
              { title: "Graduation Ceremony", date: "June 15, 2025", type: "Ceremony" }
            ].map((event, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="p-8 bg-white rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {event.type}
                    </span>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <a href="mailto:info@university.edu" className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Mail className="h-5 w-5 mr-2" />
                  info@university.edu
                </a>
                <a href="tel:+1234567890" className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Phone className="h-5 w-5 mr-2" />
                  (+216) 12 345 678
                </a>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-2" />
                  123 University Ave, City, State
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/programs" className="text-gray-300 hover:text-white transition-colors">Programs</a></li>
                <li><a href="/admissions" className="text-gray-300 hover:text-white transition-colors">Admissions</a></li>
                <li><a href="/campus-life" className="text-gray-300 hover:text-white transition-colors">Campus Life</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/library" className="text-gray-300 hover:text-white transition-colors">Library</a></li>
                <li><a href="/research" className="text-gray-300 hover:text-white transition-colors">Research</a></li>
                <li><a href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/alumni" className="text-gray-300 hover:text-white transition-colors">Alumni</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} ISIMM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;