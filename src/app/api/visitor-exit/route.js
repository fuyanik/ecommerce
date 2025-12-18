import { NextResponse } from 'next/server';
import { doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { visitorId } = body;
    
    if (!visitorId) {
      return NextResponse.json({ error: 'Visitor ID required' }, { status: 400 });
    }
    
    // Update history with exit time
    try {
      const historyRef = doc(db, 'visitor_history', visitorId);
      await updateDoc(historyRef, {
        exitedAt: serverTimestamp(),
        isActive: false
      });
    } catch (e) {
      // History doc might not exist
    }
    
    // Remove from active visitors
    await deleteDoc(doc(db, 'active_visitors', visitorId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor exit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

