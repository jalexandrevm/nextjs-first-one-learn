export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string; // e.g., "2025-11-07"
  time: string; // e.g., "09:00 AM"
};

export const events: EventItem[] = [
  {
    image: "/images/tech-summit.jpg",
    title: "Tech Summit 2025",
    slug: "tech-summit-2025",
    location: "São Paulo, SP",
    date: "2025-11-15",
    time: "09:00 AM",
  },
  {
    image: "/images/react-conference.jpg",
    title: "React Conference Brasil",
    slug: "react-conference-brasil",
    location: "Rio de Janeiro, RJ",
    date: "2025-11-20",
    time: "10:30 AM",
  },
  {
    image: "/images/web-dev-workshop.jpg",
    title: "Web Development Workshop",
    slug: "web-dev-workshop",
    location: "Belo Horizonte, MG",
    date: "2025-11-25",
    time: "02:00 PM",
  },
  {
    image: "/images/devops-meetup.jpg",
    title: "DevOps Meetup",
    slug: "devops-meetup",
    location: "Curitiba, PR",
    date: "2025-12-01",
    time: "06:00 PM",
  },
  {
    image: "/images/ai-future.jpg",
    title: "AI & Machine Learning Future",
    slug: "ai-machine-learning-future",
    location: "Brasília, DF",
    date: "2025-12-05",
    time: "01:30 PM",
  },
  {
    image: "/images/full-stack.jpg",
    title: "Full Stack Development Conference",
    slug: "full-stack-conference",
    location: "Recife, PE",
    date: "2025-12-10",
    time: "08:00 AM",
  },
  {
    image: "/images/mobile-dev.jpg",
    title: "Mobile Development Summit",
    slug: "mobile-dev-summit",
    location: "Fortaleza, CE",
    date: "2025-12-15",
    time: "03:15 PM",
  },
  {
    image: "/images/cloud-native.jpg",
    title: "Cloud Native & Kubernetes",
    slug: "cloud-native-kubernetes",
    location: "Salvador, BA",
    date: "2025-12-20",
    time: "11:00 AM",
  },
  {
    image: "/images/javascript-fest.jpg",
    title: "JavaScript Fest Brasil",
    slug: "javascript-fest-brasil",
    location: "Manaus, AM",
    date: "2026-01-08",
    time: "04:45 PM",
  },
  {
    image: "/images/startup-pitch.jpg",
    title: "Tech Startup Pitch Day",
    slug: "tech-startup-pitch",
    location: "Porto Alegre, RS",
    date: "2026-01-15",
    time: "07:30 PM",
  },
]