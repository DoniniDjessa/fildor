Voici la spécification détaillée pour cette page Couture & Déstockage, avec la fameuse "Sidebar d'Historique" à droite.

FICHIER : 25_production_stock_ui.md
Copie ce fichier pour ton IA.

Markdown

# 25_PRODUCTION_STOCK_UI.MD - SUIVI CONSO & DÉSTOCKAGE

## 1. Philosophie : "Qui a utilisé quoi ?"
Cette page est le journal de bord de l'atelier. Elle sert à deux choses :
1.  **Déduire le stock** en temps réel pendant la coupe.
2.  **Tracer l'activité** (Feed) pour savoir qui travaille sur quoi.

---

## 2. Layout Global (Split Screen)

La page est divisée verticalement en deux zones fixes (pas de scroll global).

### ZONE GAUCHE : L'Espace de Travail (65% largeur)
C'est ici que les couturiers déclarent leur consommation.
- **Header :** "Déclaration de Coupe".
- **Contenu :** Un sélecteur de commande actif + Un formulaire rapide.

### ZONE DROITE : Le "Live Feed Atelier" (35% largeur)
C'est la demande spécifique : une longue colonne qui part de la Navbar jusqu'au bas de l'écran.
- **Style :** Fond blanc, bordure gauche discrète, ombre portée vers la gauche.
- **Scroll :** Interne (seule cette colonne scrolle si la liste est longue).
- **Contenu :** Timeline des actions récentes.

---

## 3. UI Zone Gauche : Le "Quick Deduct"

On évite les formulaires complexes. On veut de la vitesse.

### A. Sélecteur de Commande (Visual Grid)
Une grille de cartes représentant les commandes au statut **"En Coupe"** ou **"Couture"**.
- **Carte Commande :**
  - Photo Modèle/Tissu.
  - Nom Client (Gras).
  - Badge : "Prévu : 3 yards".
- **Interaction :** Au clic, la commande est sélectionnée.

### B. Le Panneau de Déduction (Une fois commande sélectionnée)
Apparaît en dessous ou remplace la grille.
1.  **Matière :** Pré-remplie si définie dans la commande (ex: "Bazin Riche Bleu"). Sinon, liste déroulante recherche.
2.  **Quantité utilisée :**
    - Input géant numérique.
    - Unité (m/yards) affichée à côté.
    - Boutons rapides : `[ Tout le coupon ]` `[ 1/2 ]`.
3.  **Qui coupe ?** (Sélecteur d'employé, ex: "Ali Sanogo").
    - *Note :* Si l'employé est connecté avec son compte, c'est auto-rempli.
4.  **Bouton Action :** Gros bouton rouge dégradé `✂️ CONFIRMER COUPE`.

---

## 4. UI Zone Droite : Le "Log Vertical" (Full Height)

C'est la colonne "Historique".

### Container
- `h-[calc(100vh-64px)]` (Hauteur écran moins navbar).
- `overflow-y-auto` (Scrollable).
- `bg-white border-l border-slate-100 p-4`.

### Header de la Colonne
- Titre : "Activité Atelier".
- Sous-titre : "Aujourd'hui".

### Les Items (Les Logs)
Design type "Timeline" connectée par un trait vertical fin.

**Item Card :**
- **Avatar :** Photo de l'employé (Ali Sanogo).
- **Contenu Texte (Rich Text) :**
  - "Ali a coupé **3.5m** de *Soie Italienne*."
  - "Pour : **Commande Mariam T.**"
- **Metas :**
  - Heure : "Il y a 2 min".
  - Indicateur Stock : Petit badge rouge `Stock -3.5`.

---

## 5. Le Flow (Logique Métier)

1.  **Sélection :** Le couturier clique sur la carte "Commande Mariam T." (qui est au statut 'Coupe').
2.  **Vérification :** Le système affiche : "Stock disponible pour Soie Italienne : 12m".
3.  **Saisie :** Le couturier tape "3" (mètres).
4.  **Validation :** Clic sur "Confirmer".
5.  **Backend Updates (Transaction Atomique) :**
    - `Stock Tissu` : 12 - 3 = **9m**.
    - `Commande` : Statut passe de 'À couper' à 'Cousu' (optionnel) ou ajoute une ligne de coût réel.
    - `Logs` : Création d'une entrée "Ali / Mariam / 3m".
6.  **Animation UI :**
    - La colonne de droite flashe ou ajoute le nouvel item en haut avec une animation `slide-down`.
    - Le stock disponible se met à jour instantanément.

---

## 6. Exemple Code (Activity Log Item)

```tsx
// components/ActivityLogItem.tsx
import { Scissors, User } from 'lucide-react';

export const ActivityLogItem = ({ log }) => {
  return (
    <div className="relative pl-6 pb-8 border-l-2 border-slate-100 last:border-0 last:pb-0">
      {/* Point sur la timeline */}
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#FF754C] ring-4 ring-white flex items-center justify-center">
        <Scissors size={8} className="text-white" />
      </div>

      <div className="flex flex-col gap-1">
        {/* Header : Qui et Quand */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <User size={10} /> {log.employee_name}
          </span>
          <span className="text-[9px] text-slate-400">{log.time_ago}</span>
        </div>

        {/* Corps : Quoi */}
        <div className="bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">
          <p className="text-[11px] text-slate-600 leading-tight">
            A utilisé <span className="font-bold text-[#6C5DD3]">{log.quantity}{log.unit}</span> de <span className="font-medium">{log.material_name}</span>
          </p>
          <div className="mt-1 pt-1 border-t border-slate-200/50">
            <p className="text-[10px] text-slate-400">
              📂 {log.order_ref}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};