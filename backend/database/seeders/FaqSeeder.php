<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

/**
 * Initial FAQ content. Questions are matched by text, so re-running keeps edits made in the panel.
 */
class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $position = 0;

        foreach ($this->faqs() as $category => $items) {
            foreach ($items as $question => $answer) {
                Faq::firstOrCreate(['question' => $question], [
                    'category' => $category,
                    'answer' => $answer,
                    'position' => ++$position,
                ]);
            }
        }
    }

    /**
     * @return array<string, array<string, string>>
     */
    private function faqs(): array
    {
        return [
            'Sobre a KUMUKA' => [
                'O que é a KUMUKA?' => 'A KUMUKA é uma plataforma de aprendizagem para jovens em Angola. Ligamos conteúdo prático, exercícios e evidências do que aprendeste a experiências e oportunidades reais de estágio e emprego.',
                'A KUMUKA é paga?' => 'As trilhas disponíveis neste momento são gratuitas. Se no futuro existirem conteúdos pagos, isso estará indicado de forma clara na página de cada trilha, antes de começares.',
                'Posso usar a KUMUKA no telemóvel?' => 'Sim. A plataforma funciona no navegador do telemóvel, do tablet e do computador. As lições foram pensadas para serem curtas e leves, para gastarem poucos dados.',
            ],
            'Conta e acesso' => [
                'Como crio uma conta?' => 'Carrega em "Começar agora". Primeiro crias a conta com o teu email e uma password; depois respondes a algumas perguntas rápidas (nome, situação, interesses e objectivo) para recomendarmos as trilhas certas para ti.',
                'Esqueci-me da password. O que faço?' => 'Na página de entrada, carrega em "Esqueci-me da password" e indica o teu email. Vais receber um link para criar uma nova password, válido durante 60 minutos.',
                'Porque é que a sessão terminou sozinha?' => 'Por segurança, as sessões expiram ao fim de algum tempo e quando a password é alterada. Basta entrares novamente: o teu progresso fica guardado.',
            ],
            'Aprender na plataforma' => [
                'Como funcionam as trilhas?' => 'Cada trilha está dividida em módulos e cada módulo em lições curtas, com textos, exemplos, vídeos ou PDFs. No fim de cada lição há uma verificação rápida e no fim de cada módulo um quiz. Há também uma tarefa prática para aplicares o que aprendeste.',
                'Como é contado o meu progresso?' => 'O progresso conta o que fizeste de facto: uma lição fica concluída quando assistes aos vídeos e acertas a verificação; um módulo fica concluído quando passas no quiz e entregas a tarefa. Abrir uma página não conta como estudar.',
                'O que é o "domínio"?' => 'É a média das tuas melhores notas nos quizzes da trilha. Mostra o quanto sabes, e não só quanto avançaste.',
                'E se não passar no quiz do módulo?' => 'Lês a explicação de cada resposta, revês as lições indicadas e tentas de novo depois de alguns minutos. Sempre que possível, a nova tentativa traz perguntas diferentes.',
                'Posso continuar noutro dispositivo?' => 'Sim. O progresso fica guardado na tua conta, por isso podes começar no telemóvel e continuar no computador.',
            ],
            'Conquistas e certificados' => [
                'O que são as conquistas?' => 'São marcos que desbloqueias ao avançar: completar o perfil, concluir a primeira actividade, terminar a primeira trilha, participar numa experiência, entre outros. Aparecem no teu perfil e no painel.',
                'As trilhas dão certificado?' => 'Algumas trilhas indicam na sua página que incluem certificado de conclusão. Ao concluir uma dessas trilhas, desbloqueias a conquista "Primeiro Certificado" no teu perfil.',
            ],
            'Oportunidades e experiências' => [
                'Como me candidato a uma oportunidade?' => 'Abre a oportunidade e carrega em "Candidatar-me" ou "Tenho interesse". O estado da tua candidatura (registada, em análise, encaminhada ou fechada) é actualizado pela equipa e aparece na tua conta.',
                'O que são as experiências?' => 'São workshops, eventos, mentorias, desafios e visitas organizados com parceiros. Inscreves-te na página da experiência, enquanto houver vagas.',
                'A KUMUKA pede dinheiro para garantir uma vaga?' => 'Não. Nunca pedimos pagamentos para te candidatares ou para garantir uma vaga. Se alguém o fizer em nome da KUMUKA ou de uma empresa, é uma tentativa de burla.',
            ],
        ];
    }
}
