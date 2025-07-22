export const portfolioData = {
  about: `
    My name is Daroh. I'm a passionate full-stack developer with expertise in technologies.<br><br>
    Type 'skills' to see my technical skills or 'projects' to view my work.
  `,
  skills: [
    { category: 'Languages', items: 'JavaScript, TypeScript, Python, Java' },
    { category: 'Frontend', items: 'React, Next.js, Angular, Vue.js, Tailwind CSS, ShadCN/UI, Framer Motion, Font Awesome' },
    { category: 'Backend', items: 'Node.js, Express.js, PHP, Django, Spring Boot, JWT' },
    { category: 'Databases & Cloud', items: 'PostgreSQL, MongoDB, Mongoose, Redis, Supabase, AWS' },
    { category: 'AI & Mobile', items: 'Google Generative AI SDK, Flutter, Dart' },
    { category: 'Data Science & ML', items: 'Scikit-learn, Pandas, NumPy, Matplotlib, Jupyter Notebook, Gradio' },
    { category: 'Tools & DevOps', items: 'Git, Docker, Docker Compose, CI/CD, Vite, Nginx, Arduino' }
  ],
  experience: `
    <span class="text-green-400">Work Experience</span><br>
    <span class="text-yellow-400">Software Engineer Internship @ Kirirom Institute of Technology</span><br>
    Mar 2024 - Jun 2025<br><br>
    <span class="text-cyan-400">Autonomous Robot</span> <span class="text-gray-400">(May 2024 - September 2024)</span><br>
    - Served as the designer for both the autonomous robot hardware and the mobile application to control it<br>
    &nbsp;&nbsp;-- Designed and engineered robot mechanics with microcontrollers and sensor integration<br>
    &nbsp;&nbsp;-- Programmed robot logic for autonomous user-following capabilities and movement algorithms<br>
    &nbsp;&nbsp;-- Developed mobile application using MIT App Inventor for remote robot control<br>
    &nbsp;&nbsp;-- Implemented Arduino-based embedded systems for seamless hardware-software communication<br>
    &nbsp;&nbsp;-- Created intuitive user interface for real-time robot monitoring and control<br><br>
    <span class="text-cyan-400">Vehicle Maintenance App</span> <span class="text-gray-400">(November 2024 - February 2025)</span><br>
    - Led backend development and infrastructure design for AI-powered predictive vehicle maintenance platform<br>
    &nbsp;&nbsp;-- Architected and implemented scalable backend services using Flutter and Dart<br>
    &nbsp;&nbsp;-- Integrated Google Generative AI SDK for predictive maintenance analytics<br>
    &nbsp;&nbsp;-- Designed database schemas and API endpoints using Supabase for real-time data processing<br>
    &nbsp;&nbsp;-- Implemented Google APIs integration for vehicle data collection and analysis<br>
    &nbsp;&nbsp;-- Built robust authentication and user management systems<br>
    &nbsp;&nbsp;-- Optimized backend performance for handling large-scale vehicle diagnostic data<br><br>
    <span class="text-cyan-400">Restaurant Operations Platform</span> <span class="text-gray-400">(March 2025 - June 2025)</span><br>
    - Led the development team and the backend architecture for a comprehensive restaurant management system<br>
    &nbsp;&nbsp;-- Managed development team coordination and project timeline execution<br>
    &nbsp;&nbsp;-- Architected scalable backend infrastructure using Next.js and PHP<br>
    &nbsp;&nbsp;-- Designed and implemented robust RESTful APIs for restaurant operations management<br>
    &nbsp;&nbsp;-- Integrated MongoDB for optimized database performance and data modeling<br>
    &nbsp;&nbsp;-- Implemented Google Generative AI SDK for automated restaurant insights and recommendations<br>
    &nbsp;&nbsp;-- Built responsive frontend components using ShadCN/UI and Tailwind CSS<br>
    &nbsp;&nbsp;-- Integrated Framer Motion for enhanced user experience and animations<br><br>
    <span class="text-cyan-400">Recipe AI Drink</span> <span class="text-gray-400">(June 2025 - July 2025)</span><br>
    - Served as AI Engineer specializing in generative AI integration for personalized drink recipe creation<br>
    &nbsp;&nbsp;-- Integrated and fine-tuned Google's Generative AI for creative recipe generation algorithms<br>
    &nbsp;&nbsp;-- Developed intelligent prompt engineering for personalized drink recommendations<br>
    &nbsp;&nbsp;-- Implemented dynamic web application using Next.js for seamless user interactions<br>
    &nbsp;&nbsp;-- Designed AI model integration architecture for real-time recipe customization<br>
    &nbsp;&nbsp;-- Built responsive UI/UX using Tailwind CSS and ShadCN component library<br>
    &nbsp;&nbsp;-- Implemented Supabase for user preferences storage and recipe history tracking<br>
    &nbsp;&nbsp;-- Optimized AI response times and accuracy for enhanced user experience<br>
  `,
  education: `
    <span class="text-green-400">Education</span><br>
    <span class="text-yellow-400">Bachelor of Science in Software Engineering</span><br>
    Kirirom Institute of Technology, Feb 2023 - Feb 2027
  `,
  projects: [
    {
      title: 'Autonomous Robot',
      description: 'Designed an autonomous robot capable of following a user. This project involved hands-on work with microcontrollers and sensors, programming the robot\'s logic and movement capabilities for seamless autonomous operation.',
      stack: 'Arduino, MIT App Inventor',
      date: 'May 2024 - September 2024'
    },
    {
      title: 'Vehicle Maintenance App',
      description: 'Developed the backend infrastructure for an innovative AI-powered mobile application for predictive vehicle maintenance. I was responsible for building the core logic and services that power the app\'s AI features and data processing.',
      stack: 'Flutter, Dart, Supabase, Google Gen AI SDK, Google APIs',
      date: 'November 2024 - February 2025'
    },
    {
      title: 'Restaurant Operations Platform',
      description: 'As project leader, I led the development of the backend architecture for a comprehensive restaurant operations platform. My work involved designing and implementing scalable systems, robust APIs, and optimized database solutions to enhance operational efficiency.',
      stack: 'Next.js, PHP, ShadCN/UI, Tailwind CSS, Framer Motion, MongoDB, Google Gen AI SDK',
      date: 'March 2025 - June 2025'
    },
    {
      title: 'Recipe AI Drink',
      description: 'Served as an AI Engineer, leveraging Google\'s Generative AI to create a dynamic web application that generates unique and personalized drink recipes. My role focused on integrating the AI model to provide a creative and interactive user experience.',
      stack: 'Next.js, Tailwind CSS, Supabase, ShadCN, Google Gen AI SDK',
      date: 'June 2025 - June 2025'
    }
  ],
  mlProjects: [
    {
      title: 'Loan Approval Prediction',
      description: 'Developed a machine learning model to predict loan approval outcomes by analyzing applicant data. This project involved data preprocessing, feature engineering, and model evaluation to achieve high accuracy and provide actionable insights for financial decision-making.',
      stack: 'Python, Scikit-learn, Pandas, NumPy, Matplotlib'
    },
    {
      title: 'Cambodia Wildfire Prediction',
      description: 'Constructed a predictive model to forecast wildfire occurrences in Cambodia using meteorological and satellite data. My work included data analysis, feature selection, and implementing ML algorithms to support early warning systems and mitigation efforts.',
      stack: 'Python, Scikit-learn, Pandas, NumPy, Jupyter Notebook, Gradio'
    }
  ],
  personalProjects: [
    {
      title: 'Dteam',
      description: 'A comprehensive gaming platform inspired by Steam, featuring a modern web interface built with Angular and TypeScript. The platform includes user authentication, game library management, and social features, all powered by a robust Node.js backend with Express.js and MongoDB. Deployed using Docker containers with Nginx for production-ready performance.',
      stack: 'Angular, TypeScript, Tailwind CSS, Font Awesome, Node.js, Express.js, MongoDB, Mongoose, JWT, Vite, Docker, Nginx',
    }
  ],
  contact: `
    <span class="text-green-400">Contact Information</span><br>
    <span class="text-yellow-400"><i class="fas fa-envelope"></i> Email:</span> <a href='mailto:darosouh@gmail.com' class='text-blue-400 hover:underline'>darosouh@gmail.com</a><br>
    <span class="text-yellow-400"><i class="fab fa-github"></i> GitHub:</span> <a href='https://github.com/Sou-Daroh' class='text-blue-400 hover:underline' target='_blank'>github.com/Sou-Daroh</a><br>
    <span class="text-yellow-400"><i class="fab fa-linkedin"></i> LinkedIn:</span> <a href='https://www.linkedin.com/in/daroh-sou' class='text-blue-400 hover:underline' target='_blank'>linkedin.com/in/daroh-sou</a><br>
  `,
  fastfetch: {
    name: "daroh",
    title: "Software Engineer",
    os: "terminal",
    shell: "zsh",
    packages: "npm",
    editor: "VS Code",
    contact: {
      email: "darosouh@gmail.com",
      github: "Sou-Daroh",
      linkedin: "Daroh-Sou",
    },
    art: `                                    
                 #*#                    
              #%%%%%%%%%%               
            #%%%%%%%%@@@@%%             
            %@@%#*+==++*#%%%            
           %%%+====-====+#%@            
           %%%++**=--+#**#@%            
           %@*+*#*+==*****%@            
           %#+==--=-======#*            
            +#==--===+--=+*             
              +==+===+++=+              
              ++=-=====++               
               +++=-==+++               
               +===++===*%              
         ####+-==-----==+######         
     *#######*-===----==+#####*####     
   **##########--------*#####*******    
  ***###########%*+*#########********   
  ##*#*####################*******#***  
    `
  }
}; 