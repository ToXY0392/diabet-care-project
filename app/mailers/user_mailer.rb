# Emails lies au compte utilisateur (reinitialisation de mot de passe, etc.).
class UserMailer < ApplicationMailer
  # Envoie un lien vers le formulaire de nouveau mot de passe. L'URL contient un jeton
  # signe a duree limitee (voir User#password_reset_token).
  def password_reset(user)
    @user = user
    @reset_url = edit_password_reset_url(user.password_reset_token)

    mail(subject: "Reinitialisation de votre mot de passe DiabetCare", to: user.email)
  end
end
