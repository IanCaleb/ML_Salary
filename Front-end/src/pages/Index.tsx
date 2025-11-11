import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, TrendingUp, Users, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Calcule seu salário de forma inteligente
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10">
              Responda algumas perguntas e descubra quanto você pode ganhar baseado no seu perfil profissional
            </p>
            
            <Button
              size="lg"
              onClick={() => navigate("/calculadora")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground text-lg">
              Três passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Preencha o formulário</h3>
              <p className="text-muted-foreground">
                Informe seus dados profissionais e pessoais
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Análise automática</h3>
              <p className="text-muted-foreground">
                Processamos seus dados com nosso algoritmo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Veja o resultado</h3>
              <p className="text-muted-foreground">
                Receba seu salário estimado instantaneamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Por que usar?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Preciso</h4>
              <p className="text-muted-foreground text-sm">Considera múltiplos fatores do mercado</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Rápido</h4>
              <p className="text-muted-foreground text-sm">Resultado em poucos minutos</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Gratuito</h4>
              <p className="text-muted-foreground text-sm">100% grátis, sem cadastro</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Descubra quanto você pode ganhar
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/calculadora")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
          >
            Calcular Agora
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 Calculadora Salarial
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
