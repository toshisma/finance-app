-- =============================================
-- SEED DATA FOR SAM & ANNELYSE
-- =============================================

-- This will be run after user registration
-- Placeholder function for demo data insertion

CREATE OR REPLACE FUNCTION insert_demo_data(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Create demo account
  INSERT INTO accounts (user_id, name, type, balance, currency, color, icon, is_shared)
  VALUES (user_uuid, 'Compte Joint', 'checking', 2500.00, 'EUR', '#8b5cf6', 'users', true);
  
  -- Create personal accounts
  INSERT INTO accounts (user_id, name, type, balance, currency, color, icon)
  VALUES (user_uuid, 'Livret A', 'savings', 5000.00, 'EUR', '#10b981', 'piggy-bank'),
         (user_uuid, 'Compte Crédit', 'credit', -500.00, 'EUR', '#ef4444', 'credit-card');
  
  -- Create budgets
  INSERT INTO budgets (user_id, category, amount_limit, period, is_shared)
  VALUES (user_uuid, 'Alimentation', 600.00, 'monthly', true),
         (user_uuid, 'Logement', 1200.00, 'monthly', true),
         (user_uuid, 'Transport', 200.00, 'monthly', true),
         (user_uuid, 'Loisirs', 150.00, 'monthly', false),
         (user_uuid, 'Shopping', 200.00, 'monthly', false),
         (user_uuid, 'Santé', 100.00, 'monthly', true);
  
  -- Create goals
  INSERT INTO goals (user_id, title, description, target_amount, current_amount, deadline, is_shared, color, icon)
  VALUES (user_uuid, 'Vacances d''été', 'Voyage en Grèce', 3000.00, 1500.00, '2026-08-01', true, '#3b82f6', 'plane'),
         (user_uuid, 'Nouvelle voiture', 'Mise de côté pour l''achat', 5000.00, 2000.00, '2027-01-01', true, '#10b981', 'car'),
         (user_uuid, 'Fonds d''urgence', '6 mois de dépenses', 10000.00, 4500.00, NULL, true, '#f59e0b', 'shield');
  
  -- Create sample transactions
  INSERT INTO transactions (user_id, amount, type, category, description, date, is_shared)
  VALUES 
    (user_uuid, 2500.00, 'income', 'Salaire', 'Salaire Sam', '2026-01-15', false),
    (user_uuid, 2200.00, 'income', 'Salaire', 'Salaire Annelyse', '2026-01-15', false),
    (user_uuid, 150.50, 'expense', 'Alimentation', 'Courses Carrefour', '2026-01-16', true),
    (user_uuid, 89.90, 'expense', 'Alimentation', 'Courses Leclerc', '2026-01-17', true),
    (user_uuid, 45.00, 'expense', 'Transport', 'Essence', '2026-01-18', true),
    (user_uuid, 1200.00, 'expense', 'Logement', 'Loyer', '2026-01-01', true),
    (user_uuid, 65.00, 'expense', 'Loisirs', 'Cinéma et restaurants', '2026-01-19', false),
    (user_uuid, 35.00, 'expense', 'Santé', 'Pharmacie', '2026-01-20', true),
    (user_uuid, 200.00, 'expense', 'Shopping', 'Vêtements', '2026-01-21', false);
  
  -- Create welcome notification
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (user_uuid, 'Bienvenue sur Finance App !', 'Commencez à suivre vos finances ensemble.', 'success');
END;
$$ LANGUAGE plpgsql;
