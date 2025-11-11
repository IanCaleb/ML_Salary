import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const salary = location.state?.salary || 0;

  useEffect(() => {
    if (!location.state?.salary) {
      navigate("/");
    }
  }, [location.state, navigate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-12 bg-card border-border text-center">
        <h1 className="text-6xl font-bold text-foreground mb-8">
          {formatCurrency(salary)}
        </h1>
        <Button
          onClick={() => navigate("/calculadora")}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Recalcular
        </Button>
      </Card>
    </div>
  );
};

export default Result;
