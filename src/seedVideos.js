import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Video } from "./models/video.models.js";

dotenv.config({ path: "./.env" });

const sampleVideos = [
  {
    title: "Complete Modern React 19 & Vite Crash Course (2026)",
    description: "Learn how to build lightning-fast web applications using React 19 and Vite from scratch. We cover project setup, Tailwind CSS v4, hooks, and clean architecture.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1245,
    Views: 14200,
    isPublished: true,
  },
  {
    title: "Building a Full Stack YouTube Clone with Node.js & MongoDB",
    description: "In this comprehensive guide, we build a scalable video streaming platform with authentication, file uploads, Cloudinary media handling, and MongoDB aggregations.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/elephants.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1890,
    Views: 8530,
    isPublished: true,
  },
  {
    title: "Mastering Tailwind CSS v4 - Design Systems for Developers",
    description: "Deep dive into Tailwind CSS v4. Learn how to craft responsive layouts, custom utility components, fluid animations, and dark mode themes easily.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 730,
    Views: 23100,
    isPublished: true,
  },
  {
    title: "System Design Essentials: How Video Streaming Platforms Scale",
    description: "Understand chunked video streaming, Content Delivery Networks (CDNs), adaptive bitrate encoding (HLS/DASH), and caching mechanisms at scale.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/rafting.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 945,
    Views: 41200,
    isPublished: true,
  },
  {
    title: "Redux Toolkit Tutorial: Global State Management Simplified",
    description: "Say goodbye to boilerplate redux. Learn how to configure stores, create slices, handle async thunks, and integrate state into modern React UI effortlessly.",
    VideoFile: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 620,
    Views: 6780,
    isPublished: true,
  },
  {
    title: "Next.js 15 Server Components & Server Actions Masterclass",
    description: "Step-by-step walkthrough of React Server Components, Server Actions, streaming SSR, and SEO optimization in Next.js 15.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1540,
    Views: 19800,
    isPublished: true,
  },
  {
    title: "Docker & Kubernetes for Complete Beginners: From Zero to Cluster",
    description: "Demystifying containers and orchestration. Learn how to containerize a Node.js backend and deploy a multi-service pod to Kubernetes.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/elephants.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 2100,
    Views: 32400,
    isPublished: true,
  },
  {
    title: "PostgreSQL & Prisma ORM: Building Bulletproof Databases",
    description: "Master relational schema design, complex relations, database indexing, foreign keys, and query optimization using Prisma ORM.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1320,
    Views: 11500,
    isPublished: true,
  },
  {
    title: "TypeScript Deep Dive: Generics, Utility Types & Type Guards",
    description: "Upgrade your JavaScript code with production-grade TypeScript. We cover advanced generics, conditional types, inference, and type narrowing.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/rafting.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1516116211227-bbc679091931?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 890,
    Views: 16700,
    isPublished: true,
  },
  {
    title: "WebSockets & Socket.io: Build a Real-Time Live Chat App",
    description: "Learn bidirectional real-time communication between browser and server. Implementing private rooms, typing indicators, and message broadcasts.",
    VideoFile: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1120,
    Views: 28900,
    isPublished: true,
  },
  {
    title: "AI Engineering 101: Building LLM Apps with LangChain & OpenAI",
    description: "Create AI agents, Retrieval-Augmented Generation (RAG) pipelines, and vector database search with Python and Node.js.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1450,
    Views: 54100,
    isPublished: true,
  },
  {
    title: "Linux Command Line & Bash Scripting: Automate Everything",
    description: "Essential terminal commands every software developer must know. Piping, grep, awk, sed, file permissions, and automated bash scripts.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/elephants.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 980,
    Views: 18300,
    isPublished: true,
  },
  {
    title: "Microservices Architecture in Node.js with RabbitMQ",
    description: "Decouple monolithic backends into scalable microservices using asynchronous message queues, event driven architecture, and consumers.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1780,
    Views: 14700,
    isPublished: true,
  },
  {
    title: "Mastering Git & GitHub: Branching, Rebasing & Resolving Conflicts",
    description: "Become confident with professional git workflows. Interactive rebasing, cherry-picking, stash management, and collaborative pull requests.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/rafting.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 670,
    Views: 22400,
    isPublished: true,
  },
  {
    title: "Redis In-Depth: Caching, Pub/Sub & Rate Limiting",
    description: "Accelerate your database response times from 300ms to 2ms using Redis in-memory storage, token bucket rate limiters, and session management.",
    VideoFile: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 850,
    Views: 31200,
    isPublished: true,
  },
  {
    title: "GraphQL vs REST API: Complete Guide with Apollo Server",
    description: "Compare query structures, over-fetching vs under-fetching, resolvers, schemas, and real-time GraphQL subscriptions with hands-on code.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1040,
    Views: 12900,
    isPublished: true,
  },
  {
    title: "Web Security 101: Preventing XSS, CSRF & SQL Injection",
    description: "Understand common web vulnerabilities outlined by OWASP Top 10 and implement defensive security headers, sanitization, and CORS safely.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/elephants.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1210,
    Views: 45600,
    isPublished: true,
  },
  {
    title: "Building Mobile Apps with React Native & Expo in 2026",
    description: "Cross-platform mobile development made easy. Learn navigation, camera access, local notifications, and deploying to iOS and Android.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1670,
    Views: 27800,
    isPublished: true,
  },
  {
    title: "UI/UX Design for Software Engineers: Spacing, Typography & Color",
    description: "Practical design rules to transform developer-made interfaces into polished, world-class products that users love using.",
    VideoFile: "https://res.cloudinary.com/demo/video/upload/rafting.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 790,
    Views: 38900,
    isPublished: true,
  },
  {
    title: "Clean Code & Refactoring: Writing Maintainable JavaScript",
    description: "Identify code smells, apply SOLID principles, write declarative functions, and decouple complex modules for maximum longevity.",
    VideoFile: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    ThumbnailFile: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    VideoDuration: 1100,
    Views: 21500,
    isPublished: true,
  },
];

async function seed() {
  try {
    const mongoUri = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // Find an existing user to own these videos
    let owner = await User.findOne();

    if (!owner) {
      console.log("No user found. Creating a demo creator user...");
      owner = await User.create({
        username: "demo_creator",
        email: "creator@example.com",
        fullname: "TubeNext Creator",
        password: "password123",
        avatar: {
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          publicId: "demo_avatar",
        },
        coverImage: {
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
          publicId: "demo_cover",
        },
        isEmailVerified: true,
      });
      console.log("Demo creator user created:", owner._id);
    } else {
      console.log(`Using existing user as owner: ${owner.username} (${owner._id})`);
    }

    // Attach owner to sample videos
    const videosToInsert = sampleVideos.map((video) => ({
      ...video,
      owner: owner._id,
    }));

    const inserted = await Video.insertMany(videosToInsert);
    console.log(`Successfully added ${inserted.length} videos!`);

    for (const v of inserted) {
      console.log(`- [${v._id}] "${v.title}"`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
