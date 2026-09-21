import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const storage = inject(StorageService);
    const router = inject(Router);

    const user = storage.getUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(user.userType)) {
      return true;
    }

    // Role unauthorized for this route -> redirect to main dashboard
    router.navigate(['/dashboard']);
    return false;
  };
};
