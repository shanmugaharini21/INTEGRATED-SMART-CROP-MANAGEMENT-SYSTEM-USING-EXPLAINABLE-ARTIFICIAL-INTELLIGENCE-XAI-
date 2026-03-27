import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Leaf, Mail, Phone, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/hooks/useApp";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // EMAIL LOGIN
const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await axios.post("http://localhost:5000/login", {
      email,
      password,
    });

    const user = response.data.user;

    if (response.data.success && user?.id) {
      // Pass only the ID for login
      await login(user);
      navigate("/dashboard");
    } else {
      alert(response.data.message || "Login failed: missing user ID");
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again.");
  }

  setIsLoading(false);
};

  // PHONE LOGIN
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      alert("Please enter your phone number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        phone
      });

      if (response.data.success) {
        login(response.data.user);
        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    }

    setIsLoading(false);
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Leaf className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            AgroPredict
          </h1>

          <p className="text-lg text-primary-foreground/80 max-w-md mx-auto">
            Smart crop recommendations powered by soil analysis, weather data and farmer observations
          </p>

        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >

          {/* MOBILE LOGO */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">
                CropHealth
              </span>
            </div>
          </div>

          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to manage your fields
            </p>
          </div>

          {/* LOGIN TABS */}
          <Tabs defaultValue="email" className="w-full">

            <TabsList className="grid w-full grid-cols-2 mb-6">

              <TabsTrigger value="phone" className="flex gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>

              <TabsTrigger value="email" className="flex gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>

            </TabsList>

            {/* PHONE LOGIN */}
            <TabsContent value="phone">

              <form onSubmit={handlePhoneLogin} className="space-y-4">

                <div>
                  <Label htmlFor="phone">Phone Number</Label>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    className="mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

              </form>

            </TabsContent>

            {/* EMAIL LOGIN */}
            <TabsContent value="email">

              <form onSubmit={handleEmailLogin} className="space-y-4">

                <div>
                  <Label>Email Address</Label>

                  <Input
                    type="email"
                    placeholder="farmer@example.com"
                    className="mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                </div>

                <div>
                  <Label>Password</Label>

                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

              </form>

            </TabsContent>

          </Tabs>

          {/* REGISTER LINK */}
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </span>
          </div>

          {/* DIVIDER */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* GUEST LOGIN */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGuestLogin}
          >
            <User className="mr-2 h-4 w-4" />
            Continue as Guest
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-2">
            Guest data won't be saved
          </p>

        </motion.div>

      </div>
    </div>
  );
};

export default Login;