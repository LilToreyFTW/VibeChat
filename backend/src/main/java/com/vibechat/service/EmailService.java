package com.vibechat.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${vibechat.room.base-url}")
    private String baseUrl;

    @Value("${vibechat.email.smtp.host:smtp.gmail.com}")
    private String smtpHost;

    @Value("${spring.mail.username:noreply@vibechat.com}")
    private String fromEmail;

    @Value("${vibechat.email.enabled:true}")
    private boolean emailEnabled;

    public void sendVerificationEmail(String toEmail, String username, String verificationToken) {
        if (!emailEnabled) {
            System.out.println("Email sending is disabled. Verification token for " + username + ": " + verificationToken);
            return;
        }

        if (mailSender == null) {
            System.out.println("Mail sender not configured. Verification token for " + username + ": " + verificationToken);
            return;
        }

        try {
            String verificationUrl = baseUrl + "/verify-email?token=" + verificationToken;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("VibeChat - Verify Your Email Address");
            helper.setFrom(fromEmail);

            String htmlContent = """
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to VibeChat!</h1>
                    </div>

                    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-bottom: 20px;">Hi %s,</h2>

                        <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                            Thank you for signing up for VibeChat! To complete your registration and start creating amazing chat rooms, please verify your email address.
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>

                        <p style="color: #999; font-size: 14px; margin-top: 25px;">
                            If you didn't create an account with VibeChat, you can safely ignore this email.
                        </p>

                        <p style="color: #999; font-size: 14px;">
                            For security reasons, this verification link will expire in 24 hours.
                        </p>

                        <p style="color: #999; font-size: 12px; margin-top: 15px;">
                            Verification Token: %s
                        </p>
                    </div>

                    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 10px; margin-top: 20px;">
                        <p style="color: #666; font-size: 12px; margin: 0;">
                            This email was sent by VibeChat. If you have any questions, please contact our support team.
                        </p>
                    </div>
                </body>
                </html>
                """.formatted(username, verificationUrl, verificationToken);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Verification email sent to " + toEmail);

        } catch (Exception e) {
            System.err.println("Failed to send verification email to " + toEmail + ": " + e.getMessage());
            // For development, log the verification URL instead of throwing an exception
            System.out.println("Verification URL for " + username + ": " + baseUrl + "/verify-email?token=" + verificationToken);
        }
    }

    public String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }
}
