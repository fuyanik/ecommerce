"use client";

import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import app from "./firebase";

const db = getFirestore(app);
const storage = getStorage(app);

const ORDERS_COLLECTION = "orders";

const sanitizeFileName = (fileName) =>
  fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");

const uploadFile = async (file, storagePath) => {
  if (!file) return null;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const downloadURL = await getDownloadURL(storageRef);

  return {
    url: downloadURL,
    storagePath,
    name: file.name,
    type: file.type,
    size: file.size,
  };
};

const createOrderDocument = async ({
  orderType,
  product,
  customer,
  shipping,
  notes,
  imageFile,
}) => {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const orderRef = doc(ordersRef);
  const orderId = orderRef.id;
  const createdAt = new Date().toISOString();

  let imageData = null;
  if (imageFile) {
    const sanitizedName = sanitizeFileName(imageFile.name || "media");
    const storagePath = `${ORDERS_COLLECTION}/${orderId}/order_${Date.now()}_${sanitizedName}`;
    imageData = await uploadFile(imageFile, storagePath);
  }

  const orderPayload = {
    orderType,
    product,
    customer,
    shipping,
    notes: notes || "",
    image: imageData,
    status: "awaiting_payment",
    paymentStatus: "awaiting_receipt",
    payment: {
      receiptUrl: null,
      receiptStoragePath: null,
      uploadedAt: null,
      receiptName: null,
    },
    createdAt,
    updatedAt: createdAt,
  };

  await setDoc(orderRef, orderPayload);

  return {
    id: orderId,
    ...orderPayload,
  };
};

export const createFigureOrder = async ({
  imageFile,
  size,
  price,
  name,
  phone,
  address,
  city,
  notes,
}) => {
  if (!imageFile) {
    throw new Error("Lütfen siparişiniz için bir görsel yükleyin.");
  }

  return createOrderDocument({
    orderType: "3d-figure",
    product: {
      size,
      price,
    },
    customer: {
      name,
      phone,
    },
    shipping: {
      address,
      city,
    },
    notes,
    imageFile,
  });
};

export const createAniKuresiOrder = async ({
  mediaFile,
  packageType,
  price,
  name,
  phone,
  address,
  city,
  notes,
}) => {
  if (!mediaFile) {
    throw new Error("Lütfen anı küresi için bir medya dosyası yükleyin.");
  }

  return createOrderDocument({
    orderType: "ani-kuresi",
    product: {
      packageType,
      price,
    },
    customer: {
      name,
      phone,
    },
    shipping: {
      address,
      city,
    },
    notes,
    imageFile: mediaFile,
  });
};

export const uploadOrderReceipt = async (orderId, receiptFile) => {
  if (!orderId) {
    throw new Error("Sipariş kimliği bulunamadı.");
  }

  if (!receiptFile) {
    throw new Error("Lütfen dekont dosyasını yükleyin.");
  }

  const sanitizedName = sanitizeFileName(receiptFile.name || "receipt");
  const storagePath = `${ORDERS_COLLECTION}/${orderId}/receipt_${Date.now()}_${sanitizedName}`;
  const receiptData = await uploadFile(receiptFile, storagePath);
  const updatedAt = new Date().toISOString();

  const updates = {
    paymentStatus: "receipt_submitted",
    status: "awaiting_verification",
    payment: {
      receiptUrl: receiptData?.url || null,
      receiptStoragePath: receiptData?.storagePath || null,
      uploadedAt: updatedAt,
      receiptName: receiptFile.name,
    },
    updatedAt,
  };

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), updates);

  return updates;
};

export const subscribeToOrders = (callback, onError = console.error) => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
      callback(orders);
    },
    onError
  );
};

export const updateOrderStatus = async (orderId, updates) => {
  if (!orderId) {
    throw new Error("Sipariş kimliği bulunamadı.");
  }

  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), payload);

  return payload;
};

