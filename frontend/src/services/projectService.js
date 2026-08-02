import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export const INITIAL_DEV_PROJECTS = [
  {
    title: 'AI-Powered Web Platform',
    description:
      'A full-stack web application leveraging large language models for intelligent automation and seamless user interactions. Built with React and FastAPI.',
    tags: ['React', 'FastAPI', 'AI/LLM', 'MongoDB'],
    status: 'In Development',
    type: 'dev',
    image: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    order: 1,
    externalLink: '',
    privacyPolicyLink: ''
  },
  {
    title: 'Expense Tracker',
    description:
      'A personal finance Android app to track expenses across multiple bank accounts and payment apps. Features camera-based receipt capture, offline mode, and smart categorisation.',
    tags: ['Android', 'Kotlin', 'Camera API', 'Offline', 'Finance'],
    status: 'Publishing Soon',
    type: 'dev',
    image: 'https://images.unsplash.com/photo-1782898669120-53aac9b0464e?crop=entropy&cs=srgb&fm=jpg&w=600&q=85',
    order: 2,
    externalLink: '',
    privacyPolicyLink: '/privacy-policy'
  },
  {
    title: 'Smart Dashboard Suite',
    description:
      'Enterprise-grade analytics dashboard with real-time data visualization and AI-powered business intelligence insights.',
    tags: ['Angular', 'Data Viz', 'Enterprise', 'AI'],
    status: 'In Development',
    type: 'dev',
    image: 'https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&w=600',
    order: 3,
    externalLink: '',
    privacyPolicyLink: ''
  }
];

export const INITIAL_3D_PROJECTS = [
  {
    title: 'Mechanical Gear Assembly',
    description:
      'Precision-engineered interlocking gear system designed for educational demonstrations. Optimized for FDM printing with minimal support structures.',
    tags: ['Mechanical', 'FDM', 'CAD', 'Educational'],
    status: 'In Development',
    type: '3d',
    image: 'https://images.unsplash.com/photo-1698807390276-725f3a7e41cf?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    order: 1,
    externalLink: '',
    privacyPolicyLink: ''
  },
  {
    title: 'Custom Enclosure Design',
    description:
      'Functional protective housing for electronic components, designed with ventilation and cable management in mind. Material-optimized for durability.',
    tags: ['Enclosure', 'Electronics', 'Functional', 'CAD'],
    status: 'In Development',
    type: '3d',
    image: 'https://images.unsplash.com/photo-1566410824233-a8011929225c?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    order: 2,
    externalLink: '',
    privacyPolicyLink: ''
  },
  {
    title: 'Artistic Sculpture Series',
    description:
      'A collection of abstract geometric sculptures exploring the creative limits of additive manufacturing and mathematical form generation.',
    tags: ['Art', 'Geometric', 'Abstract', 'Sculpture'],
    status: 'In Development',
    type: '3d',
    image: 'https://images.pexels.com/photos/13156181/pexels-photo-13156181.jpeg?auto=compress&cs=tinysrgb&w=600',
    order: 3,
    externalLink: '',
    privacyPolicyLink: ''
  }
];

const PROJECTS_COLLECTION = 'projects';

export async function seedInitialProjects() {
  try {
    const batch = writeBatch(db);
    const allInit = [...INITIAL_DEV_PROJECTS, ...INITIAL_3D_PROJECTS];
    for (const proj of allInit) {
      const docRef = doc(collection(db, PROJECTS_COLLECTION));
      batch.set(docRef, {
        ...proj,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    await batch.commit();
    console.log('Successfully seeded initial projects into Firestore');
  } catch (err) {
    console.error('Error seeding projects:', err);
    throw err;
  }
}

export function subscribeProjects(onSuccess, onError) {
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy('order', 'asc'));
  
  return onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) {
      if (auth.currentUser) {
        try {
          await seedInitialProjects();
          return;
        } catch (e) {
          console.warn('Auto seed skipped or failed:', e);
        }
      }
      // If unauthenticated or auto-seed failed, provide initial default projects as fallback
      const fallbackItems = [...INITIAL_DEV_PROJECTS, ...INITIAL_3D_PROJECTS].map((p, idx) => ({
        id: `default-${idx}`,
        ...p
      }));
      onSuccess(fallbackItems);
    } else {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onSuccess(items);
    }
  }, (err) => {
    console.error('Firestore snapshot error:', err);
    const fallbackItems = [...INITIAL_DEV_PROJECTS, ...INITIAL_3D_PROJECTS].map((p, idx) => ({
      id: `default-${idx}`,
      ...p
    }));
    onSuccess(fallbackItems);
    if (onError) onError(err);
  });
}

export async function addProject(projectData) {
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
    ...projectData,
    order: Number(projectData.order) || 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateProject(id, projectData) {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...projectData,
    order: Number(projectData.order) || 1,
    updatedAt: serverTimestamp()
  });
}

export async function deleteProject(id) {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}
