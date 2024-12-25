import { BrowserRouter } from "react-router-dom";

import { Github, About, Contact, Experience, IndividualSocialHandle, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";
// import IndividualSocialHandle from "./components/IndividualSocialHandle";

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Github />
        <Experience />
        <Tech />
        <Works />
        {/* <Feedbacks /> */}
        <IndividualSocialHandle />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
