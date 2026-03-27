import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Farmer } from "@/types";
import { format } from "date-fns";

interface FarmerProfileCardProps {
  farmer: Farmer;
}

const FarmerProfileCard: React.FC<FarmerProfileCardProps> = ({ farmer }) => {

  const formattedDate = farmer?.createdAt
    ? format(new Date(farmer.createdAt), "MMMM yyyy")
    : "Recently";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-border">

        {/* TOP BANNER */}
        <div className="h-20 gradient-hero" />

        <CardContent className="pt-0 -mt-10">

          {/* PROFILE HEADER */}
          <div className="flex items-end gap-4 mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card border-4 border-card shadow-lg">
              <User className="h-10 w-10 text-primary" />
            </div>

            <div className="pb-2">
              <h2 className="font-display text-xl font-bold text-foreground">
                {farmer?.name || "Farmer"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Farmer Profile
              </p>
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="space-y-3">

            {farmer?.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{farmer.email}</span>
              </div>
            )}

            {farmer?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{farmer.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">
                {farmer?.location || "Location not specified"}
              </span>
            </div>

            {/* MEMBER DATE */}
            <div className="flex items-center gap-3 text-sm pt-2 border-t border-border">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Member since {formattedDate}
              </span>
            </div>

          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FarmerProfileCard;