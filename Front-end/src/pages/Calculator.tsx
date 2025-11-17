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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // --- Cálculo correto da idade ---
      const nascimento = new Date(formData.nascimento);
      const hoje = new Date();

      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();

      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      // --------------------------------

      // Objeto que o backend espera
      const payload = {
        Age: idade,
        EducationNum: Number(formData.anosEstudo),
        CapitalGain: Number(formData.ganhoCapital || 0),
        CapitalLoss: Number(formData.percaCapital || 0),
        HoursPerWeek: Number(formData.horasSemanais),

        Workclass: formData.classeTrabalho,
        Education: formData.escolaridade,
        MaritalStatus: formData.estadoCivil,
        Occupation: formData.ocupacao,
        Relationship: formData.relacionamento,
        Race: formData.raca,
        Sex: formData.sexo,
        NativeCountry: formData.paisOrigem,
      };

      // Enviar para o backend
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      navigate("/resultado", { state: { salary: data.prediction } });
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao calcular. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Calculadora Salarial
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados para calcular seu salário estimado
          </p>
        </div>

        <Card className="p-8 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nascimento">
                  Nascimento
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="nascimento"
                  type="date"
                  required
                  value={formData.nascimento}
                  onChange={(e) =>
                    setFormData({ ...formData, nascimento: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">
                  Estado civil
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>

                <Select
                  required
                  value={formData.estadoCivil}
                  onValueChange={(value) =>
                    setFormData({ ...formData, estadoCivil: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Estado civil" />
                  </SelectTrigger>

                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Divorced">Divorciado(a)</SelectItem>
                    <SelectItem value="Married-AF-spouse">
                      Casado(a) — Militar
                    </SelectItem>
                    <SelectItem value="Married-civ-spouse">
                      Casado(a) — Civil
                    </SelectItem>
                    <SelectItem value="Married-spouse-absent">
                      Casado(a) — Cônjuge ausente
                    </SelectItem>
                    <SelectItem value="Never-married">
                      Nunca casado(a)
                    </SelectItem>
                    <SelectItem value="Separated">Separado(a)</SelectItem>
                    <SelectItem value="Widowed">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="raca">
                  Raça<span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>

                <Select
                  required
                  value={formData.raca}
                  onValueChange={(value) =>
                    setFormData({ ...formData, raca: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Raça" />
                  </SelectTrigger>

                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Amer-Indian-Eskimo">
                      Indígena / Esquimó
                    </SelectItem>
                    <SelectItem value="Asian-Pac-Islander">
                      Asiático / Ilhas do Pacífico
                    </SelectItem>
                    <SelectItem value="Black">Negro(a)</SelectItem>
                    <SelectItem value="Other">Outra</SelectItem>
                    <SelectItem value="White">Branco(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">
                  Sexo<span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>
                <Select
                  required
                  value={formData.sexo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sexo: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Sexo" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Male">Masculino</SelectItem>
                    <SelectItem value="Female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paisOrigem">
                  País de origem
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>

                <Select
                  required
                  value={formData.paisOrigem}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paisOrigem: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="País de origem" />
                  </SelectTrigger>

                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="brazil">Brasil</SelectItem>
                    <SelectItem value="Cambodia">Camboja</SelectItem>
                    <SelectItem value="Canada">Canadá</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Columbia">Colômbia</SelectItem>
                    <SelectItem value="Cuba">Cuba</SelectItem>
                    <SelectItem value="Dominican-Republic">
                      República Dominicana
                    </SelectItem>
                    <SelectItem value="Ecuador">Equador</SelectItem>
                    <SelectItem value="El-Salvador">El Salvador</SelectItem>
                    <SelectItem value="England">Inglaterra</SelectItem>
                    <SelectItem value="France">França</SelectItem>
                    <SelectItem value="Germany">Alemanha</SelectItem>
                    <SelectItem value="Greece">Grécia</SelectItem>
                    <SelectItem value="Guatemala">Guatemala</SelectItem>
                    <SelectItem value="Haiti">Haiti</SelectItem>
                    <SelectItem value="Holand-Netherlands">Holanda</SelectItem>
                    <SelectItem value="Honduras">Honduras</SelectItem>
                    <SelectItem value="Hong">Hong Kong</SelectItem>
                    <SelectItem value="?">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocupacao">
                  Ocupação
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>

                <Select
                  required
                  value={formData.ocupacao}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ocupacao: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Ocupação" />
                  </SelectTrigger>

                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Adm-clerical">
                      Administrativo / Secretariado
                    </SelectItem>
                    <SelectItem value="Armed-Forces">Forças Armadas</SelectItem>
                    <SelectItem value="Craft-repair">
                      Artesanato / Reparos
                    </SelectItem>
                    <SelectItem value="Exec-managerial">
                      Executivo / Gerencial
                    </SelectItem>
                    <SelectItem value="Farming-fishing">
                      Agricultura / Pesca
                    </SelectItem>
                    <SelectItem value="Handlers-cleaners">
                      Manuseio / Limpeza
                    </SelectItem>
                    <SelectItem value="Machine-op-inspct">
                      Operador / Inspetor de Máquinas
                    </SelectItem>
                    <SelectItem value="Other-service">
                      Outros serviços
                    </SelectItem>
                    <SelectItem value="Priv-house-serv">
                      Serviço doméstico
                    </SelectItem>
                    <SelectItem value="Prof-specialty">
                      Profissional especializado
                    </SelectItem>
                    <SelectItem value="Protective-serv">
                      Serviço de segurança
                    </SelectItem>
                    <SelectItem value="Sales">Vendas</SelectItem>
                    <SelectItem value="Tech-support">
                      Suporte técnico
                    </SelectItem>
                    <SelectItem value="Transport-moving">Transporte</SelectItem>
                    <SelectItem value="?">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {" "}
                <Label htmlFor="classeTrabalho">
                  {" "}
                  Classe de trabalho{" "}
                  <span className="text-red-500 font-bold ml-0.5">*</span>{" "}
                </Label>{" "}
                <Select
                  required
                  value={formData.classeTrabalho}
                  onValueChange={(value) =>
                    setFormData({ ...formData, classeTrabalho: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Classe de trabalho" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="?">Outro</SelectItem>
                    <SelectItem value="Federal-gov">Governo Federal</SelectItem>
                    <SelectItem value="Local-gov">Governo Local</SelectItem>
                    <SelectItem value="Never-worked">
                      Nunca trabalhou
                    </SelectItem>
                    <SelectItem value="Private">Privado</SelectItem>
                    <SelectItem value="Self-emp-inc">
                      Autônomo incorporado
                    </SelectItem>
                    <SelectItem value="Self-emp-not-inc">
                      Autônomo não incorporado
                    </SelectItem>
                    <SelectItem value="State-gov">Governo Estadual</SelectItem>
                    <SelectItem value="Without-pay">
                      Trabalho voluntário / sem pagamento
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relacionamento">
                  Relacionamento
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>

                <Select
                  required
                  value={formData.relacionamento}
                  onValueChange={(value) =>
                    setFormData({ ...formData, relacionamento: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Relacionamento" />
                  </SelectTrigger>

                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Husband">Marido</SelectItem>
                    <SelectItem value="Not-in-family">
                      Sem relação familiar
                    </SelectItem>
                    <SelectItem value="Other-relative">
                      Outro parente
                    </SelectItem>
                    <SelectItem value="Own-child">Filho(a)</SelectItem>
                    <SelectItem value="Unmarried">Solteiro(a)</SelectItem>
                    <SelectItem value="Wife">Esposa</SelectItem>
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
                  onChange={(e) =>
                    setFormData({ ...formData, ganhoCapital: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, percaCapital: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="escolaridade">
                  Escolaridade
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>

                <Select
                  required
                  value={formData.escolaridade}
                  onValueChange={(value) =>
                    setFormData({ ...formData, escolaridade: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Escolaridade" />
                  </SelectTrigger>

                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Preschool">Pré-escola</SelectItem>
                    <SelectItem value="1st-4th">1ª a 4ª série</SelectItem>
                    <SelectItem value="5th-6th">5ª a 6ª série</SelectItem>
                    <SelectItem value="7th-8th">7ª a 8ª série</SelectItem>
                    <SelectItem value="9th">9º ano</SelectItem>
                    <SelectItem value="10th">10º ano</SelectItem>
                    <SelectItem value="11th">11º ano</SelectItem>
                    <SelectItem value="12th">12º ano</SelectItem>
                    <SelectItem value="HS-grad">
                      Ensino Médio Completo
                    </SelectItem>
                    <SelectItem value="Some-college">
                      Alguma Faculdade
                    </SelectItem>
                    <SelectItem value="Assoc-acdm">
                      Associado Acadêmico
                    </SelectItem>
                    <SelectItem value="Assoc-voc">
                      Associado Vocacional
                    </SelectItem>
                    <SelectItem value="Bachelors">Bacharelado</SelectItem>
                    <SelectItem value="Masters">Mestrado</SelectItem>
                    <SelectItem value="Doctorate">Doutorado</SelectItem>
                    <SelectItem value="Prof-school">
                      Escola Profissionalizante
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horasSemanais">
                  Horas trabalhadas por semana
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="horasSemanais"
                  type="number"
                  required
                  placeholder="Horas trabalhadas por semana"
                  value={formData.horasSemanais}
                  onChange={(e) =>
                    setFormData({ ...formData, horasSemanais: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anosEstudo">
                  Anos de estudo{" "}
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="anosEstudo"
                  type="number"
                  required
                  placeholder="Anos de estudo"
                  value={formData.anosEstudo}
                  onChange={(e) =>
                    setFormData({ ...formData, anosEstudo: e.target.value })
                  }
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
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
              >
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
