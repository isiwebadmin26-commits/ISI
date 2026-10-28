import { Award, Users, Headset, MapPin, Shield, Zap } from "lucide-react";

const trustItems = [
  { icon: Award, label: "ISO Certified" },
  { icon: Users, label: "Experienced Team" },
  { icon: Headset, label: "24×7 Support" },
  { icon: MapPin, label: "PAN India Operations" },
  { icon: Shield, label: "Enterprise Security" },
  { icon: Zap, label: "Rapid Response" },
];

export const TrustBar = () => {
  return (
    <div className="bg-card border-y border-border/50 py-4 sm:py-5 relative z-20 shadow-xs">
      <div className="container mx-auto px-4 lg:px-8">
        <div 
          className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-x-6 sm:gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-3 overflow-x-auto scrollbar-hide no-scrollbar w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
              <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-semibold text-foreground text-xs sm:text-sm md:text-base whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
