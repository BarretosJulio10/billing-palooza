
import { supabase } from '@/integrations/supabase/client';
import { Organization, User as AppUser } from '@/types/organization';

export async function fetchUserData(userId: string): Promise<{ 
  appUser: AppUser | null; 
  organization: Organization | null;
}> {
  try {
    console.log(`Fetching user data for user ID: ${userId}`);
    
    // Fetch user data - RLS will automatically filter based on auth.uid()
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, organizations(*)')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }
    
    if (!userData) {
      console.log("No user data found, user might need to complete profile");
      return {
        appUser: null,
        organization: null,
      };
    }
    
    console.log("User data found:", userData);
    
    const appUser: AppUser = {
      id: userData.id,
      organizationId: userData.organization_id || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      email: userData.organizations?.email || '',
      role: userData.role as 'admin' | 'user',
      createdAt: userData.created_at || '',
      updatedAt: userData.updated_at || ''
    };

    const organization: Organization | null = userData.organizations ? {
      id: userData.organizations.id,
      name: userData.organizations.name,
      email: userData.organizations.email || '',
      phone: userData.organizations.phone || '',
      createdAt: userData.organizations.created_at || '',
      updatedAt: userData.organizations.updated_at || '',
      subscriptionStatus: userData.organizations.subscription_status as 'active' | 'overdue' | 'canceled' | 'permanent',
      subscriptionDueDate: userData.organizations.subscription_due_date || '',
      subscriptionAmount: userData.organizations.subscription_amount || 0,
      lastPaymentDate: userData.organizations.last_payment_date || '',
      gateway: userData.organizations.gateway as 'mercadopago' | 'asaas',
      isAdmin: userData.organizations.is_admin || false,
      blocked: userData.organizations.blocked || false
    } : null;

    return {
      appUser,
      organization
    };
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    return {
      appUser: null,
      organization: null
    };
  }
}
