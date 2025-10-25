import { dbAdmin } from '../../../lib/firebase-admin'; 
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userA_id = searchParams.get('userA_id');
  const userB_id = searchParams.get('userB_id');

  const botSecret = request.headers.get('x-bot-secret');
  if (botSecret !== process.env.BOT_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!userA_id || !userB_id) {
    return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 });
  }

  try {
    const userADoc = await dbAdmin.collection('users').where('discordId', '==', userA_id).limit(1).get();
    const userBDoc = await dbAdmin.collection('users').where('discordId', '==', userB_id).limit(1).get();

    const userAExists = !userADoc.empty;
    const userBExists = !userBDoc.empty;

    // --- New Status Logic ---

    if (!userAExists && !userBExists) {
      return NextResponse.json({ status: 'BOTH_NOT_FOUND' });
    }

    if (!userAExists) {
      return NextResponse.json({ status: 'USER_A_NOT_FOUND' });
    }

    if (!userBExists) {
      return NextResponse.json({ status: 'USER_B_NOT_FOUND' });
    }

    // --- Both users exist, now check friendship ---
    
    const userAProfile = userADoc.docs[0].data();
    const userBProfileId = userBDoc.docs[0].id;

    const areTheyFriends = userAProfile.friends.includes(userBProfileId);

    if (areTheyFriends) {
      return NextResponse.json({ status: 'FRIENDS' });
    } else {
      return NextResponse.json({ status: 'NOT_FRIENDS' });
    }

  } catch (error) {
    console.error('Error checking friendship:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}