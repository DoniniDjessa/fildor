# 26_FEATURES_INTEGRATION_UI.MD - SOCIAL, FINANCES & PLANNING

Ce fichier détaille l'intégration de 4 fonctionnalités spécifiques demandées.

---

## 1. DÉTAILS CLIENT : La "Social Bar" & Anniversaires

Dans la page `/clients/[id]`, nous devons modifier la **Colonne 1 (Identité)** définie précédemment.

### A. La "Social Action Bar" (Communication)
Au lieu de simples liens, on crée une rangée de 3 boutons circulaires interactifs juste sous le nom du client.

**Design UI :**
- Container : `flex gap-3 justify-center my-4`.
- **Bouton WhatsApp (Primaire) :**
  - Style : `bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white`.
  - Icone : `MessageCircle`.
  - Action : Ouvre `https://wa.me/22507...?text=Bonjour...`.
- **Bouton Appel (Secondaire) :**
  - Style : `bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white`.
  - Icone : `Phone`.
  - Action : `tel:+225...`.
- **Bouton SMS (Tertiaire) :**
  - Style : `bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white`.
  - Icone : `MessageSquare`.
  - Action : `sms:+225...`.

### B. Le Widget "Anniversaire en Approche" 🎂
Si l'anniversaire est dans moins de 7 jours, une carte spéciale apparaît en haut de la fiche client.

**Design UI :**
- **Fond :** Dégradé Or/Jaune (`bg-gradient-to-r from-yellow-50 to-orange-50`).
- **Bordure :** `border border-yellow-200`.
- **Contenu :**
  - Icone : 🎂 (Cake).
  - Texte : "Anniversaire dans **3 jours** (12 Déc)."
  - **Bouton Action :** "Envoyer Vœux Promo".
    - *Clic :* Ouvre WhatsApp avec un message pré-rempli : *"Joyeux anniversaire [Nom] ! Profitez de -10% sur votre prochaine tenue chez [Nom Atelier] 🎉"*.

---

## 2. DASHBOARD : Le "Financial Switcher" (Jour/Mois/Année)

Dans la **ZONE A (Hero Graph)** du Dashboard, nous devons permettre de changer la vue temporelle.

**Design UI :**
- **Position :** En haut à droite de la carte violette.
- **Composant :** Segmented Control (Pillule segmentée).
  - Fond : `bg-black/20` (Translucide sur le fond violet).
  - Item Actif : `bg-white text-[#6C5DD3] shadow-sm rounded-full`.
  - Item Inactif : `text-white/70 hover:text-white`.
  - **Options :** `24H` | `Mois` | `Année`.

**Logique d'Affichage (Data Binding) :**
Au clic, les gros chiffres changent instantanément (sans recharger la page).
- **Vue 24H :** Affiche la recette du jour (ex: "25.000 F").
  - *Comparaison :* "Hier: 0 F".
- **Vue Mois :** Affiche le cumul mensuel (ex: "1.450.000 F").
  - *Comparaison :* "vs Mois dernier (+12%)".
- **Vue Année :** Affiche le CA annuel.

---

## 3. PAGE RDV : La Timeline Chronologique (`/appointments`)

Une nouvelle page dédiée pour remplacer l'agenda papier.

**Layout :** Une seule colonne centrale étroite (max-width: 600px) pour la lisibilité sur tablette.

### Structure "Timeline"
Liste groupée par jours relatifs.

**Groupe 1 : "Aujourd'hui" (Today)**
- Header : `Aujourd'hui • Mer 12 Déc` (Gras, gros).

**Les Cartes RDV (Appointment Card) :**
- **Design :**
  - `bg-white rounded-2xl p-4 mb-3 border-l-4 shadow-sm`.
  - La couleur de la bordure gauche indique le type.
- **Types & Couleurs :**
  - 🟣 **Essayage (Fitting) :** Border Purple (`border-l-[#6C5DD3]`).
  - 🟢 **Livraison (Delivery) :** Border Green (`border-l-[#25D366]`).
  - 🔵 **Prise de Mesures :** Border Blue (`border-l-blue-400`).

**Contenu de la Carte :**
- **Gauche (Heure) :** `14:30` (Gros, Font mono).
- **Centre (Info) :**
  - Titre : **Mme Koné** (Gras).
  - Sous-titre : *Robe Sirène Mariage* (Italique gris).
- **Droite (Actions) :**
  - Bouton Check rond (Validation).
  - Clic change l'état visuel (grisé/barré).

**Groupe 2 : "Demain"**
... Idem ...

**Groupe 3 : "Cette Semaine"**
... Idem ...

---

## 4. Exemple Code (Appointment Card)

```tsx
import { CheckCircle, MapPin } from 'lucide-react';

export const AppointmentCard = ({ rdv }) => {
  // Couleur dynamique selon le type
  const borderColors = {
    fitting: 'border-l-[#6C5DD3]',
    delivery: 'border-l-[#25D366]',
    measure: 'border-l-blue-400'
  };

  const labels = {
    fitting: 'Essayage',
    delivery: 'Livraison',
    measure: 'Mesures'
  };

  return (
    <div className={`bg-white rounded-2xl p-4 mb-3 border-l-[6px] shadow-sm flex items-center gap-4 ${borderColors[rdv.type]}`}>
      
      {/* HEURE */}
      <div className="flex flex-col items-center min-w-[50px]">
        <span className="text-xl font-bold text-slate-700">{rdv.time}</span>
        <span className="text-[10px] text-slate-400 uppercase font-medium">{labels[rdv.type]}</span>
      </div>

      {/* DÉTAILS */}
      <div className="flex-1 border-l border-slate-100 pl-4">
        <h4 className="text-sm font-bold text-[#11142D]">{rdv.client_name}</h4>
        <p className="text-xs text-slate-500 mb-1">{rdv.outfit_desc}</p>
        
        {/* Localisation (si livraison) */}
        {rdv.location && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <MapPin size={10} /> {rdv.location}
          </div>
        )}
      </div>

      {/* ACTION */}
      <button className="text-slate-300 hover:text-green-500 transition-colors">
        <CheckCircle size={28} />
      </button>

    </div>
  );
};