export interface Course {
  id: string;
  title: string;
  category: "Core" | "Specialized";
  categoryLabel: string;
  duration: string;
  hours: number;
  batchSize: number;
  description: string;
  iconName: string;
  badge?: string;
  benefits?: string[];
  learningOutcomes?: string[];
  skillsAcquired?: string[];
  practicalApplications?: string[];
  careerRelevance?: string[];
  intendedAudience?: string[];
  prerequisites?: string;
}

export const coursesData: Course[] = [
  {
    id: "C1",
    title: "AI Certification",
    category: "Core",
    categoryLabel: "Artificial Intelligence",
    duration: "3 Months",
    hours: 90,
    batchSize: 15,
    badge: "Flagship",
    description: "Industry-aligned certification program in Artificial Intelligence and Machine Learning fundamentals.",
    iconName: "Brain",
    benefits: [
      "Rigorous hands-on instruction covering core machine learning, deep learning, and predictive models",
      "Direct laboratory experience with modern ML frameworks including TensorFlow and PyTorch",
      "Practical deployment methodology for containerized AI services and inference pipelines",
      "Small cohort batch size ensuring personalized mentorship and project evaluation"
    ],
    learningOutcomes: [
      "Understand supervised, unsupervised, and reinforcement learning paradigms",
      "Construct and train convolutional and recurrent deep neural networks",
      "Implement data cleaning, feature engineering, and high-dimensional model evaluation",
      "Deploy trained ML models as RESTful microservices for real-world application consumption"
    ],
    skillsAcquired: [
      "Python for Data Science & Numerical Computation",
      "TensorFlow & PyTorch Neural Network Modeling",
      "Feature Engineering & Statistical Validation",
      "Computer Vision & Natural Language Processing Foundations",
      "API Model Serving & Docker Containerization"
    ],
    practicalApplications: [
      "Intelligent video analytics and object detection for automated surveillance",
      "Predictive maintenance forecasting for industrial machinery and sensor telemetry",
      "Automated document classification and text entity extraction systems"
    ],
    careerRelevance: [
      "AI / Machine Learning Engineer",
      "Data Scientist / Analytics Specialist",
      "Computer Vision Software Developer",
      "Applied AI Solutions Engineer"
    ],
    intendedAudience: [
      "Computer Science & Engineering graduates looking to enter AI",
      "Software developers and analysts seeking structured upskilling in ML",
      "Technical professionals transitioning into applied data science"
    ],
    prerequisites: "Working knowledge of any programming language (Python preferred) and foundational mathematics (linear algebra and basic statistics)."
  },
  {
    id: "C2",
    title: "Cyber-Security",
    category: "Core",
    categoryLabel: "Cyber Security",
    duration: "3 Months",
    hours: 90,
    batchSize: 15,
    badge: "Flagship",
    description: "Core principles of cyber defense, threat intelligence, network protection, and security management.",
    iconName: "ShieldCheck",
    benefits: [
      "End-to-end understanding of modern enterprise attack surfaces and defense postures",
      "Practical triage training with industry-standard SIEM platforms and packet analyzers",
      "Structured incident response playbooks adhering to NIST and ISO security frameworks",
      "Physical and virtual lab environments simulating real-world network breach scenarios"
    ],
    learningOutcomes: [
      "Analyze enterprise network topologies for vulnerabilities, misconfigurations, and attack vectors",
      "Monitor, detect, and mitigate real-time cyber threats using SIEM log aggregation",
      "Apply cryptographic standards, access controls, and boundary defense mechanisms",
      "Execute structured forensic triage and incident documentation following security breaches"
    ],
    skillsAcquired: [
      "Network Protocol & Packet Analysis (Wireshark, TCPDump)",
      "SIEM Event Correlation & Threat Triaging",
      "Vulnerability Scanning & Hardening (Nessus, OpenVAS)",
      "Firewall, IDS/IPS & Endpoint Detection Configuration",
      "Incident Response & NIST Cyber Security Framework SOPs"
    ],
    practicalApplications: [
      "24/7 Security Operations Center (SOC) log monitoring and alert classification",
      "Corporate network perimeter hardening and secure remote access setup",
      "Security compliance audits and internal vulnerability assessment workflows"
    ],
    careerRelevance: [
      "SOC Analyst (L1 / L2)",
      "Cybersecurity Defense Associate",
      "Network Security Support Specialist",
      "Information Security Analyst"
    ],
    intendedAudience: [
      "IT professionals, system administrators, and network engineers",
      "Graduates in Computer Science, IT, and related engineering branches",
      "Professionals aiming for careers in enterprise SOC and security operations"
    ],
    prerequisites: "Foundational understanding of computer networking (TCP/IP model, OSI layers, IP addressing) and basic Windows/Linux operating system concepts."
  },
  {
    id: "C3",
    title: "IoT & Industrial Automation",
    category: "Core",
    categoryLabel: "Internet of Things",
    duration: "3 Months",
    hours: 90,
    batchSize: 15,
    badge: "Flagship",
    description: "Connected sensor systems, edge node deployment, and smart industrial automation architectures.",
    iconName: "Cpu",
    benefits: [
      "Comprehensive hardware-to-cloud training bridging physical sensors and cloud analytics",
      "Hands-on workbench calibration with microcontrollers, PLCs, and fieldbus communication",
      "Edge-computing deployment techniques for low-latency industrial control environments",
      "Experience with industry protocols used across modern manufacturing and smart utilities"
    ],
    learningOutcomes: [
      "Program microcontrollers using embedded C/C++ and real-time operating system concepts",
      "Interface analog and digital industrial sensors with edge gateways and communication modules",
      "Implement secure industrial communication protocols including MQTT, Modbus, and OPC UA",
      "Build live telemetry dashboards and alert pipelines on leading cloud IoT architectures"
    ],
    skillsAcquired: [
      "Embedded C / C++ for Microcontrollers (ARM Cortex, STM32, ESP32)",
      "Industrial Protocols (Modbus RTU/TCP, MQTT, CoAP, CAN)",
      "PLC Programming & SCADA Integration Fundamentals",
      "Edge Telemetry Processing & Sensor Calibration",
      "Cloud IoT Gateway Configuration (AWS IoT / Azure IoT)"
    ],
    practicalApplications: [
      "Smart manufacturing sensor monitoring and predictive condition tracking",
      "Automated utility metering and environmental quality monitoring networks",
      "Remote SCADA supervision for commercial facilities and logistics hubs"
    ],
    careerRelevance: [
      "IoT Embedded Systems Engineer",
      "Industrial Automation Specialist",
      "Firmware Development Associate",
      "Smart Infrastructure Solutions Engineer"
    ],
    intendedAudience: [
      "Electronics, Electrical, Instrumentation, and Mechatronics engineers",
      "Embedded systems developers and hardware enthusiasts",
      "Industrial plant maintenance and automation technicians seeking digitization skills"
    ],
    prerequisites: "Basic knowledge of electronic circuit fundamentals and introductory programming in C or C++."
  },
  {
    id: "C4",
    title: "Automotive Cyber-Security & EV",
    category: "Specialized",
    categoryLabel: "Automotive & EV",
    duration: "3 Months",
    hours: 90,
    batchSize: 15,
    badge: "Specialized",
    description: "Securing connected vehicle networks, ECU protocols, and electric vehicle powertrain intelligence.",
    iconName: "Zap",
    benefits: [
      "Specialized curriculum addressing emerging automotive electronic security standards",
      "Practical diagnostic drills decoding in-vehicle communication buses and ECU messages",
      "Deep-dive into high-voltage battery management systems (BMS) and EV safety regulations",
      "Alignment with industry frameworks including ISO/SAE 21434 and UNECE WP.29"
    ],
    learningOutcomes: [
      "Analyze vehicle network architectures across CAN, CAN-FD, LIN, and Automotive Ethernet",
      "Identify threat vectors across connected telematics units, OBD-II ports, and infotainment systems",
      "Perform Threat Analysis and Risk Assessment (TARA) conforming to ISO/SAE 21434",
      "Examine battery management telemetry, charging safety standards, and AIS-156 safety requirements"
    ],
    skillsAcquired: [
      "CAN Bus Decoding & Diagnostic Tools (CANalyzer, SavvyCAN)",
      "Automotive ECU Threat Modeling & Vulnerability Testing",
      "ISO/SAE 21434 Automotive Cybersecurity Engineering",
      "EV Battery Management System (BMS) Telemetry Analysis",
      "High-Voltage Electrical Safety & AIS-156 Compliance SOPs"
    ],
    practicalApplications: [
      "Bench-testing electronic control units for communication tamper detection",
      "Securing over-the-air (OTA) vehicle firmware update channels",
      "EV fleet charging station security monitoring and battery health analytics"
    ],
    careerRelevance: [
      "Automotive Cybersecurity Engineer",
      "EV Systems & Telematics Specialist",
      "Vehicle Diagnostic & Testing Engineer",
      "Automotive Software Security Analyst"
    ],
    intendedAudience: [
      "Automotive, Electronics, and Mechanical Engineering graduates",
      "Embedded engineers moving into connected and electric vehicle domains",
      "Automotive tier-1 supplier engineers and quality assurance specialists"
    ],
    prerequisites: "Foundational concepts in microcontroller architecture, basic networking, or automotive electrical systems."
  },
  {
    id: "C5",
    title: "High-Performance Computing",
    category: "Specialized",
    categoryLabel: "Supercomputing & HPC",
    duration: "3 Months",
    hours: 90,
    batchSize: 15,
    badge: "Specialized",
    description: "Parallel computing architectures, cluster management, and high-throughput workload processing.",
    iconName: "Server",
    benefits: [
      "Hands-on access to multi-node compute clusters and GPU acceleration environments",
      "Mastery of parallel software engineering patterns for compute-intensive workloads",
      "Practical workload scheduling and performance profiling on enterprise Linux infrastructure",
      "Focused guidance on optimizing code execution speed and resource throughput"
    ],
    learningOutcomes: [
      "Architect and compile parallel algorithms utilizing shared and distributed memory models",
      "Program GPU accelerators using NVIDIA CUDA for massive compute parallelization",
      "Configure and manage multi-node Linux clusters with SLURM job orchestration",
      "Profile application bottlenecks, memory access latencies, and communication overheads"
    ],
    skillsAcquired: [
      "Parallel Programming with OpenMP (Shared Memory) & MPI (Distributed)",
      "GPU Acceleration Programming with NVIDIA CUDA",
      "Cluster Workload Scheduling (SLURM, PBS)",
      "High-Performance Linux Cluster Administration",
      "Performance Profiling & Optimization (Valgrind, gprof, Nsight)"
    ],
    practicalApplications: [
      "Accelerating deep learning training pipelines across distributed clusters",
      "Numerical scientific simulation and computational fluid dynamics processing",
      "High-throughput financial modeling and risk simulation engines"
    ],
    careerRelevance: [
      "HPC Systems Engineer",
      "Parallel Computing Software Developer",
      "Scientific Computing Associate",
      "Cluster Infrastructure & Operations Specialist"
    ],
    intendedAudience: [
      "Computer Science, Computational Physics, and Mathematics graduates",
      "Backend software engineers building high-throughput distributed systems",
      "Research scholars and data scientists needing scalable compute infrastructure"
    ],
    prerequisites: "Proficiency in C, C++, or Python, and familiarity with Linux command-line tools."
  },
  {
    id: "C6",
    title: "Robotics, Drones & Industrial Automation",
    category: "Specialized",
    categoryLabel: "Robotics & Avionics",
    duration: "3 Months",
    hours: 90,
    batchSize: 15,
    badge: "Specialized",
    description: "Autonomous robotic control, UAV drone navigation systems, and smart factory mechatronics.",
    iconName: "Bot",
    benefits: [
      "Integrated curriculum combining robotics software control and aerial UAV drone flight mechanics",
      "Hands-on simulation and hardware execution using ROS 2, Gazebo, and multi-rotor testbeds",
      "Practical photogrammetry, point-cloud mapping, and volumetric calculations using Pix4D",
      "Thorough coverage of regulatory guidelines and DGCA Digital Sky operational compliance"
    ],
    learningOutcomes: [
      "Develop robotic control nodes and sensor communication utilizing ROS 2 frameworks",
      "Simulate robotic kinematics and dynamic obstacle avoidance in Gazebo environments",
      "Plan autonomous UAV waypoint navigation and BVLOS flight operations safely",
      "Process drone aerial imagery into 3D point clouds, DEMs, and orthomosaics"
    ],
    skillsAcquired: [
      "Robot Operating System 2 (ROS 2) Development",
      "Gazebo Physics Simulation & Kinematics Modeling",
      "Pix4D & Photogrammetric Aerial Survey Processing",
      "Sensor Integration (LiDAR, Ultrasonic, IMU, Optical Flow)",
      "Drone Flight Dynamics & DGCA Operational Regulations"
    ],
    practicalApplications: [
      "Perimeter surveillance, autonomous border inspection, and aerial facility monitoring",
      "Agricultural vegetation index mapping and crop health evaluation",
      "Volumetric survey and 3D terrain modeling for infrastructure construction"
    ],
    careerRelevance: [
      "Robotics Systems Engineer",
      "Drone Survey & GIS Specialist",
      "Autonomous Systems Developer",
      "Industrial Mechatronics Specialist"
    ],
    intendedAudience: [
      "Aeronautical, Mechanical, Mechatronics, and Robotics engineers",
      "Surveyors, GIS specialists, and infrastructure inspection professionals",
      "Developers interested in autonomous aerial and ground robotics"
    ],
    prerequisites: "Basic programming skills (Python/C++) and introductory knowledge of classical physics and mathematics."
  },
  {
    id: "C7",
    title: "Quantum Computing",
    category: "Specialized",
    categoryLabel: "Quantum Technologies",
    duration: "3 Months",
    hours: 90,
    batchSize: 15,
    badge: "Specialized",
    description: "Quantum algorithms, qubit mechanics, and next-generation quantum computing paradigm foundations.",
    iconName: "Atom",
    benefits: [
      "Pioneering technical curriculum on quantum computing theory, algorithms, and post-quantum transitions",
      "Hands-on quantum circuit design and simulation using IBM Qiskit and cloud simulators",
      "Strategic understanding of Post-Quantum Cryptography (PQC) and Quantum Key Distribution (QKD)",
      "Exposure to National Quantum Mission goals and enterprise cryptographic preparedness"
    ],
    learningOutcomes: [
      "Formulate quantum state vectors, superposition, phase, and entanglement mathematically",
      "Construct and simulate quantum circuits using single-qubit and multi-qubit unitary gates",
      "Analyze landmark quantum algorithms including Deutsch-Jozsa, Grover, and Shor algorithms",
      "Assess vulnerability of classical RSA/ECC cryptography and evaluate NIST PQC candidate standards"
    ],
    skillsAcquired: [
      "IBM Qiskit Quantum Software Development",
      "Quantum Gate Circuit Design & Qubit State Vector Math",
      "Quantum Algorithm Formulation (Grover's Search, Phase Estimation)",
      "Post-Quantum Cryptography (ML-KEM, ML-DSA) Awareness",
      "Quantum Key Distribution (BB84 Protocol) Principles"
    ],
    practicalApplications: [
      "Simulating quantum mechanical systems and molecular properties on quantum simulators",
      "Evaluating post-quantum cryptographic readiness for banking and enterprise data archives",
      "Quantum-inspired optimization modeling for complex logistical scheduling"
    ],
    careerRelevance: [
      "Quantum Software Developer / Researcher",
      "Post-Quantum Cryptography Analyst",
      "Emerging Technologies Consultant",
      "Quantum Technology Research Associate"
    ],
    intendedAudience: [
      "Physics, Mathematics, Computer Science, and Electrical Engineering graduates",
      "Cybersecurity specialists and cryptographers preparing for post-quantum defense",
      "Research engineers and algorithmic software developers"
    ],
    prerequisites: "Foundational linear algebra (matrices, eigenvalues, complex numbers) and proficiency in Python."
  },
  {
    id: "C8",
    title: "Master Trainer Program",
    category: "Specialized",
    categoryLabel: "Train the Trainer",
    duration: "3 Months",
    hours: 120,
    batchSize: 10,
    badge: "Advanced",
    description: "Advanced pedagogical training and practical technical instruction for technology educators and leads.",
    iconName: "GraduationCap",
    benefits: [
      "Specialized pedagogical framework designed for engineering educators and technical team leaders",
      "Micro-cohort batch size (10 candidates) providing intensive 1-on-1 pedagogical critique and feedback",
      "Mastery of Outcome-Based Education (OBE) curriculum design and lab workbook formulation",
      "Structured rubrics for assessing hands-on student technical competencies and project work"
    ],
    learningOutcomes: [
      "Structure outcome-based technology syllabi aligned with industry standards and university curricula",
      "Design and execute immersive laboratory practicals that maximize learner hands-on retention",
      "Apply active-learning pedagogical strategies, continuous assessment, and formative feedback loops",
      "Manage technical training infrastructure, multi-shift scheduling, and instructional safety protocols"
    ],
    skillsAcquired: [
      "Outcome-Based Education (OBE) Curriculum Engineering",
      "Technical Instruction & Laboratory Mentorship Delivery",
      "Formative & Summative Practical Assessment Design",
      "Learner Engagement, Inquiry-Driven Pedagogy & Public Speaking",
      "Training Lab Safety, Resource Scheduling & Management"
    ],
    practicalApplications: [
      "Heading academic technology departments and engineering college specialized labs",
      "Conducting corporate technical onboarding and engineering upskilling bootcamps",
      "Designing standardized technical manuals, lab guidebooks, and evaluation rubrics"
    ],
    careerRelevance: [
      "Master Technical Instructor / Lead Faculty",
      "Corporate Technology Trainer",
      "Academic Lab Director / Curriculum Lead",
      "Technical Capability Development Manager"
    ],
    intendedAudience: [
      "Engineering college faculty, polytechnic lecturers, and academic trainers",
      "Senior technical practitioners and team leads transitioning into teaching or training roles",
      "Corporate L&D technical instructors seeking formal pedagogical credentials"
    ],
    prerequisites: "Bachelor's or Master's degree in engineering/technology or minimum 2 years of professional technical experience."
  },
  {
    id: "C9",
    title: "IEEE BLP",
    category: "Specialized",
    categoryLabel: "IEEE Blended Learning",
    duration: "2 Months",
    hours: 60,
    batchSize: 20,
    badge: "Specialized",
    description: "IEEE Blended Learning Program focusing on industry-standard engineering practices and tech skills.",
    iconName: "BookOpen",
    benefits: [
      "Curriculum aligned with IEEE international engineering standards and professional practices",
      "Blended delivery model balancing flexible digital modules with focused live laboratory practicals",
      "Fast-track 2-month duration optimized for immediate skill acquisition and career readiness",
      "Emphasis on global engineering documentation, standards compliance, and peer review rigor"
    ],
    learningOutcomes: [
      "Apply IEEE engineering standards to technical design, prototyping, and verification workflows",
      "Draft industry-grade engineering specifications, architectural diagrams, and test reports",
      "Collaborate effectively in multidisciplinary technical teams using structured review cycles",
      "Demonstrate practical proficiency across core engineering tools and quality assurance benchmarks"
    ],
    skillsAcquired: [
      "IEEE Engineering Standards & Documentation Conventions",
      "Systems Engineering & Technical Specification Writing",
      "Quality Assurance, Verification & Validation Protocols",
      "Technical Problem Formulation & Structured Troubleshooting",
      "Collaborative Engineering Project Execution"
    ],
    practicalApplications: [
      "Preparing standards-compliant technical dossiers for enterprise engineering tenders",
      "Conducting structured peer code and architectural reviews in production engineering teams",
      "Implementing quality control checkpoints in electronic and software design pipelines"
    ],
    careerRelevance: [
      "Standards & Compliance Associate",
      "Junior Systems Engineer",
      "Quality Assurance Engineering Trainee",
      "Technical Documentation & Systems Analyst"
    ],
    intendedAudience: [
      "Undergraduate engineering students and recent diploma/degree graduates",
      "Early-career technical professionals looking to formalize engineering discipline",
      "Aspirants targeting engineering roles in multinational firms adhering to IEEE benchmarks"
    ],
    prerequisites: "Enrollment in or completion of a Diploma or Degree in any engineering or technical science branch."
  }
];

export const whyChooseData = [
  {
    title: "Government-Backed Certification",
    description: "CDAC brand equity and government-backed certification trusted by industry and academia.",
    iconName: "Award"
  },
  {
    title: "Hands-on Lab Infrastructure",
    description: "Physical centres with hands-on lab infrastructure and dual-shift scheduling.",
    iconName: "Building2"
  },
  {
    title: "Industry-Aligned Learning",
    description: "Technology programs focused on current and emerging industry requirements.",
    iconName: "Target"
  },
  {
    title: "Accessible Premium Education",
    description: "High-impact structured programs designed to make premium technology education accessible.",
    iconName: "CheckCircle2"
  }
];

export const courseDeliveryData = [
  {
    title: "Flexible Duration Options",
    description: "Structured 3-month comprehensive programs & specialized 2-month IEEE BLP pathway.",
    badge: "Duration"
  },
  {
    title: "Hands-on Practical Training",
    description: "Emphasis on physical lab infrastructure, practical exercises, and real-world tools.",
    badge: "Methodology"
  },
  {
    title: "Dual-Shift Scheduling",
    description: "Weekend and evening batches available to accommodate working professionals and students.",
    badge: "Schedules"
  },
  {
    title: "Physical Lab Infrastructure",
    description: "State-of-the-art facilities located at CDAC-MEPZ Digital Technology Centre.",
    badge: "Infrastructure"
  }
];

export const targetAudienceData = [
  {
    title: "Students & Graduates",
    description: "For learners looking to build technology skills and improve career readiness.",
    iconName: "GraduationCap"
  },
  {
    title: "Working Professionals",
    description: "For professionals seeking technology upskilling and career progression.",
    iconName: "Briefcase"
  },
  {
    title: "Corporate Teams",
    description: "For organizations looking for structured technology training.",
    iconName: "Users"
  },
  {
    title: "Technology Aspirants",
    description: "For learners targeting emerging domains such as AI, Cyber-Security, EV, Robotics, HPC and Quantum Computing.",
    iconName: "Compass"
  }
];
