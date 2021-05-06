import 'firebase/auth';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import firebase from 'firebase/app';
import * as admin from 'firebase-admin';

import { LoginDto } from '../../dto/login.dto';
import { ConfigService } from '../config/config.service';
import { FirebaseUserDto } from './dto/firebase-user.dto';

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    firebase.initializeApp({
      apiKey: configService.FIREBASE_API_KEY,
    });
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(configService.FIREBASE_ADMIN_CREDENTIALS)),
    });
  }

  async create(createFirebaseUserDto: FirebaseUserDto): Promise<void> {
    try {
      await admin.auth().createUser({ emailVerified: true, ...createFirebaseUserDto });
      await admin.auth().setCustomUserClaims(createFirebaseUserDto.uid, { keys: createFirebaseUserDto.resourceKeys });
    } catch (e) {
      throw new ConflictException(e.toString());
    }
  }

  async update(updateFirebaseUserDto: FirebaseUserDto): Promise<void> {
    try {
      await admin.auth().updateUser(updateFirebaseUserDto.uid, { ...updateFirebaseUserDto });
      if (updateFirebaseUserDto.resourceKeys) {
        await admin.auth().setCustomUserClaims(updateFirebaseUserDto.uid, { keys: updateFirebaseUserDto.resourceKeys });
      }
    } catch (e) {
      throw new ConflictException(e.toString());
    }
  }

  async remove(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
    } catch (e) {
      throw new ConflictException(e.toString());
    }
  }

  async checkToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return await admin.auth().verifyIdToken(idToken, true);
  }

  async getToken(loginDto: LoginDto): Promise<string> {
    try {
      await firebase.auth().signInWithEmailAndPassword(loginDto.email, loginDto.password);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      return await currentUser.getIdToken(true);
    } else {
      throw new UnauthorizedException('There is no current user');
    }
  }

  async revokeToken(uid: string): Promise<void> {
    await admin.auth().revokeRefreshTokens(uid);
  }
}
