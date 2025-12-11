'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Search, Camera, Check } from 'lucide-react';
import { getClients } from '@/lib/actions/clients.actions';
import { getModels } from '@/lib/actions/models.actions';
import { createOrder, updateOrder } from '@/lib/actions/orders.actions';
import { uploadOrderImage } from '@/lib/actions/order-storage.actions';
import { getCurrentUser } from '@/lib/auth/actions';
import RightSidebar from '../forms/RightSidebar';

interface Client {
  id: string;
  noms?: string;
  surnom?: string;
  photo_url?: string;
}

interface Model {
  id: string;
  name: string;
  category: string;
  base_price: number;
  image_url?: string;
}

interface CreateOrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAdmin?: boolean; // Pass admin status from parent
}

type WizardStep = 1 | 2 | 3 | 4;

export default function CreateOrderWizard({ isOpen, onClose, onSuccess, isAdmin: propIsAdmin }: CreateOrderWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchClient, setSearchClient] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [isAdmin, setIsAdmin] = useState(propIsAdmin || false);

  // Order data
  const [orderData, setOrderData] = useState({
    client: null as Client | null,
    model: null as Model | null,
    fabricImage: null as File | null,
    fabricImagePreview: null as string | null,
    fabricMeters: '',
    clientReferenceImage: null as File | null,
    clientReferenceImagePreview: null as string | null,
    suppliesFromStock: [] as string[],
    sketch: null as string | null,
    advance: '',
    paymentMethod: 'cash' as 'cash' | 'wave',
    deliveryDate: '',
    reductionPercent: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setStep(1);
      setOrderData({
        client: null,
        model: null,
        fabricImage: null,
        fabricImagePreview: null,
        fabricMeters: '',
        clientReferenceImage: null,
        clientReferenceImagePreview: null,
        suppliesFromStock: [],
        sketch: null,
        advance: '',
        paymentMethod: 'cash',
        deliveryDate: '',
        reductionPercent: '',
      });
      
      // Load data
      loadClients();
      loadModels();
      
      // Use prop if provided, otherwise check
      if (propIsAdmin !== undefined) {
        setIsAdmin(propIsAdmin);
      } else {
        checkAdmin();
      }
    } else {
      // Reset admin state when closing
      setIsAdmin(propIsAdmin || false);
    }
  }, [isOpen, propIsAdmin]);
  
  // Also check admin when step changes to 4 if not provided as prop
  useEffect(() => {
    if (isOpen && step === 4 && propIsAdmin === undefined && !isAdmin) {
      checkAdmin();
    }
  }, [step, isOpen, propIsAdmin, isAdmin]);
  
  // Update isAdmin when prop changes
  useEffect(() => {
    if (propIsAdmin !== undefined) {
      setIsAdmin(propIsAdmin);
    }
  }, [propIsAdmin]);

  const checkAdmin = async () => {
    try {
      const user = await getCurrentUser();
      
      if (!user || !user.profile) {
        setIsAdmin(false);
        return;
      }
      
      const role = user.profile.role as string;
      
      // Check if user is superAdmin or admin
      // superAdmin should be considered as admin
      const admin = role === 'superAdmin' || role === 'admin';
      
      // Force update with explicit boolean
      setIsAdmin(!!admin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadModels = async () => {
    try {
      const data = await getModels();
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.noms?.toLowerCase().includes(searchClient.toLowerCase()) ||
        client.surnom?.toLowerCase().includes(searchClient.toLowerCase())) &&
      searchClient.trim() !== ''
  );

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchModel.toLowerCase()) ||
      model.category.toLowerCase().includes(searchModel.toLowerCase())
  );

  const handleNext = () => {
    if (step === 1 && !orderData.client) {
      alert('Veuillez sélectionner un client');
      return;
    }
    if (step === 2 && !orderData.model) {
      alert('Veuillez sélectionner un modèle');
      return;
    }
    if (step < 4) {
      setStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleFabricImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrderData((prev) => ({
        ...prev,
        fabricImage: file,
        fabricImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleClientReferenceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrderData((prev) => ({
        ...prev,
        clientReferenceImage: file,
        clientReferenceImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!orderData.client || !orderData.model || !orderData.deliveryDate) {
      alert('Veuillez compléter toutes les étapes');
      return;
    }

    if (!orderData.fabricImage) {
      alert('Veuillez prendre une photo du tissu');
      return;
    }

    setLoading(true);
    try {
      // First create the order to get an ID
      const order = await createOrder({
        client_id: orderData.client.id,
        model_id: orderData.model.id,
        status: 'pending',
        fabric_meters: orderData.fabricMeters || undefined,
        total_price: Math.max(0, totalPrice), // Ensure total is not negative
        advance: parseFloat(orderData.advance) || 0,
        payment_method: orderData.paymentMethod,
        delivery_date: orderData.deliveryDate,
        supplies_from_stock: orderData.suppliesFromStock,
      });

      // Upload images if provided
      let fabricImageUrl: string | undefined;
      let clientReferenceImageUrl: string | undefined;

      if (orderData.fabricImage) {
        try {
          const formData = new FormData();
          formData.append('file', orderData.fabricImage);
          formData.append('type', 'fabric');
          formData.append('orderId', order.id);
          fabricImageUrl = await uploadOrderImage(formData);
          console.log('Fabric image uploaded:', fabricImageUrl);
        } catch (error) {
          console.error('Error uploading fabric image:', error);
        }
      }

      if (orderData.clientReferenceImage) {
        try {
          const formData = new FormData();
          formData.append('file', orderData.clientReferenceImage);
          formData.append('type', 'reference');
          formData.append('orderId', order.id);
          clientReferenceImageUrl = await uploadOrderImage(formData);
          console.log('Client reference image uploaded:', clientReferenceImageUrl);
        } catch (error) {
          console.error('Error uploading reference image:', error);
        }
      }

      // Update order with image URLs if they were uploaded
      if (fabricImageUrl || clientReferenceImageUrl) {
        const updatedOrder = await updateOrder(order.id, {
          fabric_image_url: fabricImageUrl,
          client_reference_image_url: clientReferenceImageUrl,
        });
        console.log('Order updated with images:', {
          orderId: order.id,
          fabricImageUrl: updatedOrder.fabric_image_url,
          clientReferenceImageUrl: updatedOrder.client_reference_image_url,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const basePrice = orderData.model ? orderData.model.base_price : 0;
  const extraPrice = orderData.suppliesFromStock.length * 2000; // Mock extra price
  const subtotal = basePrice + extraPrice;
  const reductionPercent = isAdmin && orderData.reductionPercent ? parseFloat(orderData.reductionPercent) || 0 : 0;
  const reductionAmount = (subtotal * reductionPercent) / 100;
  const totalPrice = subtotal - reductionAmount;

  const remaining = totalPrice - (parseFloat(orderData.advance) || 0);

  return (
    <RightSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={`Nouvelle Commande - Étape ${step}/4`}
    >
      <div className="flex flex-col h-full">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? 'bg-[#6C5DD3]' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-poppins text-[#808191] dark:text-gray-400">
            <span>Client</span>
            <span>Modèle</span>
            <span>Tissu</span>
            <span>Paiement</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: Select Client */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Chercher Client...
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchClient}
                    onChange={(e) => setSearchClient(e.target.value)}
                    placeholder="Nom ou prénom..."
                    className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins focus:ring-1 focus:ring-[#6C5DD3]"
                  />
                </div>
              </div>

              {searchClient.trim() && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="font-poppins text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Aucun client trouvé
                      </p>
                      <button className="font-poppins px-4 py-2 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-xl text-xs font-semibold hover:bg-[#6C5DD3]/20 transition-colors">
                        Créer Client Express
                      </button>
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => {
                          setOrderData((prev) => ({ ...prev, client }));
                          setSearchClient('');
                        }}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          orderData.client?.id === client.id
                            ? 'bg-[#6C5DD3]/20 border-2 border-[#6C5DD3]'
                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {orderData.client?.id === client.id && (
                            <Check className="text-[#6C5DD3]" size={16} />
                          )}
                          <div className="flex-1">
                            <p className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100">
                              {client.noms || client.surnom || 'Sans nom'}
                            </p>
                            {client.surnom && client.noms && (
                              <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
                                {client.surnom}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {orderData.client && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="font-poppins text-xs text-green-700 dark:text-green-400">
                    ✓ Client sélectionné : {orderData.client.noms || orderData.client.surnom}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Model */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rechercher un modèle...
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchModel}
                    onChange={(e) => setSearchModel(e.target.value)}
                    placeholder="Nom du modèle..."
                    className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins focus:ring-1 focus:ring-[#6C5DD3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setOrderData((prev) => ({ ...prev, model }))}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      orderData.model?.id === model.id
                        ? 'bg-[#6C5DD3]/20 border-2 border-[#6C5DD3]'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg font-bold">{model.category[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1">
                          {model.name}
                        </p>
                        <p className="font-poppins text-xs text-[#808191] dark:text-gray-400">
                          {model.base_price.toLocaleString('fr-FR')} F
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {orderData.model && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="font-poppins text-xs text-green-700 dark:text-green-400">
                    ✓ Modèle sélectionné : {orderData.model.name} ({orderData.model.base_price.toLocaleString('fr-FR')} F)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Fabric & Customization */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Photo du Tissu Client */}
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Photo du Tissu Client *
                </label>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFabricImageChange}
                    className="hidden"
                  />
                  <div className="w-full h-32 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-[#6C5DD3] transition-colors">
                    {orderData.fabricImagePreview ? (
                      <img
                        src={orderData.fabricImagePreview}
                        alt="Tissu"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="font-poppins text-xs text-gray-400">Prendre photo du pagne</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Métrage reçu */}
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Métrage reçu
                </label>
                <input
                  type="text"
                  value={orderData.fabricMeters}
                  onChange={(e) => setOrderData((prev) => ({ ...prev, fabricMeters: e.target.value }))}
                  placeholder="Ex: 3 pagnes"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins px-3 focus:ring-1 focus:ring-[#6C5DD3]"
                />
              </div>

              {/* Fournitures */}
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Fournitures (Stock)
                </label>
                <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400 mb-2">
                  Ce modèle nécessite une doublure et un zip invisible.
                </p>
                <div className="space-y-2">
                  {['Doublure', 'Zip invisible', 'Boutons'].map((supply) => (
                    <label
                      key={supply}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={orderData.suppliesFromStock.includes(supply)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOrderData((prev) => ({
                              ...prev,
                              suppliesFromStock: [...prev.suppliesFromStock, supply],
                            }));
                          } else {
                            setOrderData((prev) => ({
                              ...prev,
                              suppliesFromStock: prev.suppliesFromStock.filter((s) => s !== supply),
                            }));
                          }
                        }}
                        className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]"
                      />
                      <span className="font-poppins text-xs text-[#11142D] dark:text-gray-100">
                        {supply} - Sortir du stock
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Croquis Rapide */}
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Croquis Rapide (Modifications)
                </label>
                <div className="w-full h-32 rounded-xl bg-white dark:bg-slate-900 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                  <p className="font-poppins text-xs text-gray-400">Zone de dessin (à implémenter)</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Résumé */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-3">
                  Résumé
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-poppins text-xs text-[#808191] dark:text-gray-400">
                      Prix Modèle
                    </span>
                    <span className="font-poppins text-xs font-semibold text-[#11142D] dark:text-gray-100">
                      {basePrice.toLocaleString('fr-FR')} F
                    </span>
                  </div>
                  {orderData.suppliesFromStock.length > 0 && (
                    <div className="flex justify-between">
                      <span className="font-poppins text-xs text-[#808191] dark:text-gray-400">Extra</span>
                      <span className="font-poppins text-xs font-semibold text-[#11142D] dark:text-gray-100">
                        {extraPrice.toLocaleString('fr-FR')} F
                      </span>
                    </div>
                  )}
                  {isAdmin && reductionAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="font-poppins text-xs text-green-600 dark:text-green-400">
                        Réduction ({reductionPercent}%)
                      </span>
                      <span className="font-poppins text-xs font-semibold text-green-600 dark:text-green-400">
                        -{reductionAmount.toLocaleString('fr-FR')} F
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                    <span className="font-poppins text-sm font-bold text-[#11142D] dark:text-gray-100">
                      Total
                    </span>
                    <span className="font-poppins text-sm font-bold text-[#6C5DD3]">
                      {totalPrice.toLocaleString('fr-FR')} F
                    </span>
                  </div>
                </div>
              </div>

              {/* Réduction % (Admin only) - Small input before Acompte */}
              {(isAdmin === true || isAdmin) && (
                <div>
                  <label className="block font-poppins text-[10px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Réduction % (Admin)
                  </label>
                  <input
                    type="number"
                    value={orderData.reductionPercent}
                    onChange={(e) => setOrderData((prev) => ({ ...prev, reductionPercent: e.target.value }))}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins px-3 focus:ring-1 focus:ring-[#6C5DD3]"
                  />
                </div>
              )}

              {/* Acompte */}
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Acompte (Avance)
                </label>
                <input
                  type="number"
                  value={orderData.advance}
                  onChange={(e) => setOrderData((prev) => ({ ...prev, advance: e.target.value }))}
                  placeholder="0"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins px-3 focus:ring-1 focus:ring-[#6C5DD3]"
                />
              </div>

              {/* Mode de paiement */}
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mode de paiement
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrderData((prev) => ({ ...prev, paymentMethod: 'cash' }))}
                    className={`flex-1 h-10 rounded-xl font-poppins text-xs font-semibold transition-all ${
                      orderData.paymentMethod === 'cash'
                        ? 'bg-[#6C5DD3] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Espèces
                  </button>
                  <button
                    onClick={() => setOrderData((prev) => ({ ...prev, paymentMethod: 'wave' }))}
                    className={`flex-1 h-10 rounded-xl font-poppins text-xs font-semibold transition-all ${
                      orderData.paymentMethod === 'wave'
                        ? 'bg-[#6C5DD3] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Wave
                  </button>
                </div>
              </div>

              {/* Date de Livraison */}
              <div>
                <label className="block font-poppins text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date de Livraison *
                </label>
                <input
                  type="date"
                  value={orderData.deliveryDate}
                  onChange={(e) => setOrderData((prev) => ({ ...prev, deliveryDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins px-3 focus:ring-1 focus:ring-[#6C5DD3]"
                />
              </div>

              {/* Reste à payer */}
              {remaining > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 border border-orange-200 dark:border-orange-800">
                  <p className="font-poppins text-xs text-orange-700 dark:text-orange-400">
                    Reste à payer : {remaining.toLocaleString('fr-FR')} F
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/20 dark:border-white/10 mt-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 h-10 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-poppins flex items-center justify-center gap-2"
            >
              <ChevronLeft size={16} />
              Précédent
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 h-10 text-xs font-bold text-white bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] hover:from-[#5A4BC2] hover:to-[#7A6AD8] rounded-xl transition-all shadow-lg font-poppins flex items-center justify-center gap-2"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !orderData.deliveryDate}
              className="flex-1 h-10 text-xs font-bold text-white bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] hover:from-[#5A4BC2] hover:to-[#7A6AD8] rounded-xl transition-all shadow-lg font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer la Commande'}
            </button>
          )}
        </div>
      </div>
    </RightSidebar>
  );
}

