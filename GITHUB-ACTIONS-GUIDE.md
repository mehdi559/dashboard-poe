# 🚀 Guide GitHub Actions - Build Multi-Plateformes

## 📋 Prérequis

1. **Compte GitHub** (gratuit)
2. **Repository GitHub** pour ton projet
3. **Code poussé sur GitHub**

## 🔧 Configuration

### Étape 1 : Pousser ton code sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - My Wallet App"

# Ajouter ton repository GitHub
git remote add origin https://github.com/TON_USERNAME/TON_REPO.git

# Pousser sur GitHub
git push -u origin main
```

### Étape 2 : Activer GitHub Actions

1. Va sur ton repository GitHub
2. Clique sur l'onglet **"Actions"**
3. GitHub va détecter automatiquement les workflows
4. Clique sur **"Enable Actions"**

## 🏗️ Utilisation

### Build Automatique

Chaque fois que tu pousses du code sur la branche `main`, GitHub Actions va automatiquement :

1. ✅ **Construire** l'app pour Windows, macOS et Linux
2. ✅ **Créer** les fichiers ZIP
3. ✅ **Sauvegarder** les artifacts

### Créer une Release

1. Va dans l'onglet **"Actions"** sur GitHub
2. Clique sur **"Create Release"** dans la liste des workflows
3. Clique sur **"Run workflow"**
4. Entre la version (ex: `v0.1.0`)
5. Clique sur **"Run workflow"**

## 📦 Résultats

Tu auras automatiquement :

- **Windows** : `My-Wallet-Windows-v0.1.0.zip`
- **macOS** : `My-Wallet-Mac-v0.1.0.zip`
- **Linux** : `My-Wallet-Linux-v0.1.0.zip`

## 🎯 Pour Etsy

1. **Crée une release** avec GitHub Actions
2. **Télécharge** les fichiers ZIP depuis la release
3. **Vends** chaque version pour sa plateforme respective

## 🔍 Vérification

- **Windows** : Teste sur une machine Windows
- **macOS** : Teste sur ton Mac (déjà fait)
- **Linux** : Teste sur une machine Linux ou VM

## 💡 Conseils

- **Versioning** : Utilise des versions sémantiques (v1.0.0, v1.0.1, etc.)
- **Testing** : Teste chaque version avant de vendre
- **Documentation** : Ajoute des instructions d'installation dans tes releases

## 🆘 Support

Si tu as des problèmes :
1. Vérifie les logs dans l'onglet **"Actions"**
2. Assure-toi que ton code compile localement
3. Vérifie que tous les fichiers sont bien poussés sur GitHub

---

**🎉 Félicitations ! Tu as maintenant un système de build automatique multi-plateformes !** 