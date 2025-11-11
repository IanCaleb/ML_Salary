import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  nascimento: string;
  estadoCivil: string;
  raca: string;
  sexo: string;
  paisOrigem: string;
  classeTrabalho: string;
  escolaridade: string;
  anosEstudo: string;
  ocupacao: string;
  relacionamento: string;
  ganhoCapital: string;
  percaCapital: string;
  horasSemanais: string;
}

const Calculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nascimento: "",
    estadoCivil: "",
    raca: "",
    sexo: "",
    paisOrigem: "",
    classeTrabalho: "",
    escolaridade: "", 
    anosEstudo: "",
    ocupacao: "",
    relacionamento: "",
    ganhoCapital: "",
    percaCapital: "",
    horasSemanais: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    

    let baseSalary = 3000;
    
    if (formData.escolaridade === "superior") baseSalary += 2000;
    if (formData.escolaridade === "pos-graduacao") baseSalary += 4000;
    if (parseInt(formData.anosEstudo) > 15) baseSalary += 1500;
    if (parseInt(formData.horasSemanais) > 40) baseSalary += 1000;
    if (formData.ganhoCapital) baseSalary += parseInt(formData.ganhoCapital) * 0.1;
    
    const salary = Math.max(baseSalary, 1500);
    
    navigate("/resultado", { state: { salary } });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora Salarial</h1>
          <p className="text-muted-foreground">Preencha os dados para calcular seu salário estimado</p>
        </div>

        <Card className="p-8 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nascimento">Nascimento<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Input
                  id="nascimento"
                  type="date"
                  required
                  value={formData.nascimento}
                  onChange={(e) => setFormData({ ...formData, nascimento: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado civil<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Select
                  required
                  value={formData.estadoCivil}
                  onValueChange={(value) => setFormData({ ...formData, estadoCivil: value })}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Estado civil" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="raca">Raça<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Select
                  required
                  value={formData.raca}
                  onValueChange={(value) => setFormData({ ...formData, raca: value })}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Raça" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="branco">Branco</SelectItem>
                    <SelectItem value="negro">Negro</SelectItem>
                    <SelectItem value="pardo">Pardo</SelectItem>
                    <SelectItem value="amarelo">Amarelo</SelectItem>
                    <SelectItem value="indigena">Indígena</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Select
                  required
                  value={formData.sexo}
                  onValueChange={(value) => setFormData({ ...formData, sexo: value })}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Sexo" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paisOrigem">País de origem<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Input
                  id="paisOrigem"
                  type="text"
                  required
                  placeholder="País de origem"
                  value={formData.paisOrigem}
                  onChange={(e) => setFormData({ ...formData, paisOrigem: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocupacao">Ocupação<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Input
                  id="ocupacao"
                  type="text"
                  required
                  placeholder="Ocupação"
                  value={formData.ocupacao}
                  onChange={(e) => setFormData({ ...formData, ocupacao: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classeTrabalho">Classe de trabalho<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Input
                  id="classeTrabalho"
                  type="text"
                  required
                  placeholder="Classe de trabalho"
                  value={formData.classeTrabalho}
                  onChange={(e) => setFormData({ ...formData, classeTrabalho: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relacionamento">Relacionamento<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Select
                  required
                  value={formData.relacionamento}
                  onValueChange={(value) => setFormData({ ...formData, relacionamento: value })}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Relacionamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="esposa">Esposa</SelectItem>
                    <SelectItem value="marido">Marido</SelectItem>
                    <SelectItem value="solteiro">Solteiro</SelectItem>
                    <SelectItem value="nao-familia">Não-família</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ganhoCapital">Ganho capital</Label>
                <Input
                  id="ganhoCapital"
                  type="number"
                  placeholder="Ganho capital"
                  value={formData.ganhoCapital}
                  onChange={(e) => setFormData({ ...formData, ganhoCapital: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percaCapital">Perca capital</Label>
                <Input
                  id="percaCapital"
                  type="number"
                  placeholder="Perca capital"
                  value={formData.percaCapital}
                  onChange={(e) => setFormData({ ...formData, percaCapital: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="escolaridade">Escolaridade<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Select
                  required
                  value={formData.escolaridade}
                  onValueChange={(value) => setFormData({ ...formData, escolaridade: value })}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Escolaridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="fundamental">Fundamental</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="superior">Superior</SelectItem>
                    <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horasSemanais">Horas trabalhadas por semana<span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Input
                  id="horasSemanais"
                  type="number"
                  required
                  placeholder="Horas trabalhadas por semana"
                  value={formData.horasSemanais}
                  onChange={(e) => setFormData({ ...formData, horasSemanais: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anosEstudo">Anos de estudo <span className="text-red-500 font-bold ml-0.5">*</span></Label>
                <Input
                  id="anosEstudo"
                  type="number"
                  required
                  placeholder="Anos de estudo"
                  value={formData.anosEstudo}
                  onChange={(e) => setFormData({ ...formData, anosEstudo: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Voltar
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                Calcular
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
