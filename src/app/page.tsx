import Link from 'next/link';
import { Users, Shield, Smartphone, BarChart3, PiggyBank, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#8b5cf6]/20 rounded-full blur-[120px] -z-10" />
        
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Finance App</span>
            </div>
            <Link 
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-sm font-semibold text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all shadow-lg shadow-purple-500/25"
            >
              Se connecter
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-sm text-[#8b5cf6]">Synchronisation en temps réel</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Gérez vos finances<br />
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c4b5fd] bg-clip-text text-transparent">
              à deux, simplement
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-12">
            L'application de gestion financière conçue pour Sam & Annelyse.
            Suivez vos revenus, dépenses et objectifs ensemble, en temps réel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-lg font-semibold text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all shadow-xl shadow-purple-500/30"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: 'Gestion de couple',
              description: 'Partagez vos comptes et transactions. Voyez tout en temps réel sur tous vos appareils.'
            },
            {
              icon: BarChart3,
              title: 'Tableaux de bord intelligents',
              description: 'Visualisez vos finances avec des graphiques beautiful et des statistiques claras.'
            },
            {
              icon: PiggyBank,
              title: 'Budgets & Objectifs',
              description: 'Définissez des budgets par catégorie et suivez vos objectifs d\'épargne.'
            },
            {
              icon: Smartphone,
              title: 'Application mobile',
              description: 'PWA installable sur votre téléphone. Fonctionne hors ligne et se synchronise automatiquement.'
            },
            {
              icon: Shield,
              title: 'Sécurité maximale',
              description: 'Vos données sont chiffrées et protégées. Seul vous et votre partenaire y avez accès.'
            },
            {
              icon: BarChart3,
              title: 'Rapports détaillés',
              description: 'Générez des rapports mensuels et annuels pour comprendre vos habitudes de consommation.'
            },
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-[#111118] border border-[#1f1f2e] hover:border-[#2a2a3d] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#a1a1aa]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à prendre le contrôle de vos finances ?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Rejoignez Sam et Annelyse qui gèrent leurs finances en toute transparence.
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#7c3aed] text-lg font-semibold hover:bg-[#f8fafc] transition-all shadow-xl"
            >
              Créer un compte gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-[#1f1f2e]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-[#52525b]">Finance App - Sam & Annelyse © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
