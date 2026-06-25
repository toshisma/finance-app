# 🚀 Guide de Déploiement - Finance App

## Prérequis

- Node.js 18+ installé
- Un compte [Supabase](https://supabase.com)
- Un compte [Vercel](https://vercel.com) (gratuit)

---

## Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte
2. Cliquez sur **New Project**
3. Choisissez un nom (ex: `finance-app-sam-annelyse`)
4. Sélectionnez une région proche de vous
5. **Important** : Sauvegardez le mot de passe de la base de données !

Attendez que le projet soit créé (environ 2 minutes).

---

## Étape 2 : Configurer la base de données

### 2.1 Accéder à SQL Editor

Dans votre projet Supabase :
1. Cliquez sur **SQL Editor** dans le menu de gauche
2. Cliquez sur **New query**

### 2.2 Exécuter le schéma

Copiez-collez le contenu du fichier `supabase/schema.sql` dans l'éditeur SQL, puis cliquez sur **RUN**.

### 2.3 Configurer l'authentification

1. Allez dans **Authentication** > **Settings**
2. activez **Email** comme provider
3. Configurez les URLs de redirection :
   - Site URL : `https://votre-app.vercel.app`
   - Redirect URLs : `https://votre-app.vercel.app/*`

---

## Étape 3 : Récupérer les clés API

Dans Supabase, allez dans **Settings** > **API** :

1. **Project URL** → Copiez cette valeur
2. **anon/public** key → Copiez cette valeur

---

## Étape 4 : Déployer sur Vercel

### 4.1 Préparer le projet

```bash
# Clonez le projet ou copiez les fichiers
cd finance-app

# Installez les dépendances
npm install
```

### 4.2 Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Remplacez les valeurs par celles de votre projet Supabase.

### 4.3 Déployer

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur **Add New** > **Project**
3. Importez votre projet (via GitHub ou upload direct)
4. Dans **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Cliquez sur **Deploy**

Attendez 2-3 minutes pour le déploiement.

---

## Étape 5 : Configurer Vercel (après déploiement)

1. Allez dans votre projet sur Vercel
2. Cliquez sur **Settings** > **Environment Variables**
3. Assurez-vous que les variables d'environnement sont configurées
4. Si vous avez modifié .env.local après le déploiement, recliquez sur **Redeploy**

---

## Étape 6 : Tester l'application

1. Ouvrez l'URL de votre application Vercel
2. Cliquez sur **S'inscrire**
3. Créez un compte avec votre email
4. Vous devriez voir le tableau de bord avec des données de démonstration

---

## 📱 Installer l'application mobile (PWA)

1. Ouvrez l'application dans Chrome/Safari sur mobile
2. iOS : Cliquez sur le bouton de partage > **Ajouter à l'écran d'accueil**
3. Android : Cliquez sur l'icône de menu > **Installer l'application**

---

## 🔄 Synchronisation temps réel

La synchronisation est automatiquement activée via Supabase Realtime. Quand Sam ajoute une transaction depuis son téléphone, Annelyse la voit instantanément sur son ordinateur.

---

## 🛠️ Maintenance

### Mettre à jour le code

1. Modifiez le code localement
2. Poussez sur GitHub ou recliquez sur Redeploy sur Vercel

### Sauvegarder la base de données

Supabase sauvegarde automatiquement votre base de données.

### Monitore l'application

- Vercel Dashboard : métriques de performance
- Supabase Dashboard : utilisation de la base de données

---

## ❓ Dépannage

### Erreur "Invalid API key"
- Vérifiez que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correct
- Vérifiez que l'URL Supabase ne contient pas de espaces

### Données non visibles
- Vérifiez que les policies RLS sont bien créées
- Vérifiez que l'utilisateur est bien connecté

### PWA non installable
- Vérifiez que le fichier `manifest.json` est présent
- Vérifiez la configuration du Service Worker

---

## 💡 Conseils

- Utilisez des emails réels pour tester (pour recevoir les emails de confirmation)
- Pour un compte couple, chaque partenaire doit créer son propre compte
- Les transactions "partagées" seront visibles par les deux comptes

---

**Amusez-vous bien avec votre nouvelle application de finances ! 💰**
