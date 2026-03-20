# Mailer parent : expediteur par defaut (surchargable via DEFAULT_FROM_EMAIL) et gabarit HTML/texte.
class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("DEFAULT_FROM_EMAIL", "no-reply@diabetcare.local")
  layout "mailer"
end
