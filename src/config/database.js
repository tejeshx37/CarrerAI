const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Load service account key
      const serviceAccount = require('../../careerbridge-ai-c8f42-firebase-adminsdk-fbsvc-09f10bb1bc.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://careerbridge-ai-c8f42-default-rtdb.firebaseio.com"
      });
    }
    
    console.log('✅ Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    throw error;
  }
};

// Initialize Firestore
const initializeFirestore = () => {
  try {
    const firestore = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID || 'careerbridge-ai-c8f42',
    });
    
    console.log('✅ Firestore initialized successfully');
    return firestore;
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    throw error;
  }
};

// Database collections configuration
const COLLECTIONS = {
  USERS: 'users',
  ASSESSMENTS: 'assessments',
  CAREER_PATHS: 'career_paths',
  SKILLS: 'skills',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  PSYCHOMETRIC_TESTS: 'psychometric_tests',
  MARKET_TRENDS: 'market_trends',
  RECOMMENDATIONS: 'recommendations',
  SESSIONS: 'sessions'
};

// Database helper functions
const dbHelpers = {
  // Generic document creation
  createDocument: async (collection, data, docId = null) => {
    const db = admin.firestore();
    const docRef = docId ? db.collection(collection).doc(docId) : db.collection(collection).doc();
    
    const documentData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await docRef.set(documentData);
    return { id: docRef.id, ...documentData };
  },

  // Generic document retrieval
  getDocument: async (collection, docId) => {
    const db = admin.firestore();
    const doc = await db.collection(collection).doc(docId).get();
    
    if (!doc.exists) {
      throw new Error(`Document ${docId} not found in collection ${collection}`);
    }
    
    return { id: doc.id, ...doc.data() };
  },

  // Generic document update
  updateDocument: async (collection, docId, data) => {
    const db = admin.firestore();
    const docRef = db.collection(collection).doc(docId);
    
    const updateData = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await docRef.update(updateData);
    return { id: docId, ...updateData };
  },

  // Generic document deletion
  deleteDocument: async (collection, docId) => {
    const db = admin.firestore();
    await db.collection(collection).doc(docId).delete();
    return { success: true, message: `Document ${docId} deleted from ${collection}` };
  },

  // Query documents with filters
  queryDocuments: async (collection, filters = [], orderBy = null, limit = null) => {
    const db = admin.firestore();
    let query = db.collection(collection);
    
    // Apply filters
    filters.forEach(filter => {
      query = query.where(filter.field, filter.operator, filter.value);
    });
    
    // Apply ordering
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
    }
    
    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }
    
    const snapshot = await query.get();
    const documents = [];
    
    snapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  },

  // Batch operations
  batchWrite: async (operations) => {
    const db = admin.firestore();
    const batch = db.batch();
    
    operations.forEach(operation => {
      const { type, collection, docId, data } = operation;
      const docRef = db.collection(collection).doc(docId);
      
      switch (type) {
        case 'create':
          batch.set(docRef, {
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          break;
        case 'update':
          batch.update(docRef, {
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });
    
    await batch.commit();
    return { success: true, operationsCount: operations.length };
  }
};

module.exports = {
  initializeFirebase,
  initializeFirestore,
  COLLECTIONS,
  dbHelpers,
  admin
};
