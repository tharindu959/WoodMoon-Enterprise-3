package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.model.ContactMessage;
import com.ecommerce.ecommercebackend.repository.ContactMessageRepository;
import com.ecommerce.ecommercebackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ContactController {

    @Autowired
    private ContactMessageRepository repository;

    @Autowired(required = false)
    private EmailService emailService;

    /** ✅ Create new contact message (handles question + feedback + rating) */
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveContact(@RequestBody Map<String, Object> payload) {
        try {
            ContactMessage contact = new ContactMessage();
            contact.setName((String) payload.get("name"));
            contact.setEmail((String) payload.get("email"));

            // Detect message type
            if (payload.containsKey("question") && payload.get("question") != null) {
                contact.setMessage((String) payload.get("question"));
                contact.setType("question");
            } else if (payload.containsKey("feedback") && payload.get("feedback") != null) {
                contact.setMessage((String) payload.get("feedback"));
                contact.setType("feedback");

                // Save rating if provided
                if (payload.containsKey("rating") && payload.get("rating") != null) {
                    contact.setRating(((Number) payload.get("rating")).intValue());
                }
            } else {
                contact.setMessage((String) payload.get("message")); // fallback
                contact.setType("general");
            }

            ContactMessage saved = repository.save(contact);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Message sent successfully!");
            response.put("data", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to save message.");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /** ✅ Get all messages (for admin view) */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllContacts() {
        List<ContactMessage> messages = repository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("count", messages.size());
        response.put("data", messages);
        return ResponseEntity.ok(response);
    }

    /** ✅ Get only questions */
    @GetMapping("/questions")
    public ResponseEntity<Map<String, Object>> getQuestions() {
        List<ContactMessage> questions = repository.findAll().stream()
                .filter(m -> "question".equalsIgnoreCase(m.getType()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("count", questions.size());
        response.put("data", questions);
        return ResponseEntity.ok(response);
    }

    /** ✅ Get only feedback messages */
    @GetMapping("/feedbacks")
    public ResponseEntity<Map<String, Object>> getFeedbacks() {
        List<ContactMessage> feedbacks = repository.findAll().stream()
                .filter(m -> "feedback".equalsIgnoreCase(m.getType()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("count", feedbacks.size());
        response.put("data", feedbacks);
        return ResponseEntity.ok(response);
    }

    /** ✅ Ratings Summary (for admin ratings dashboard) */
    @GetMapping("/ratings-summary")
    public ResponseEntity<Map<String, Object>> getRatingsSummary() {
        List<ContactMessage> feedbacks = repository.findAll().stream()
                .filter(m -> ("feedback".equalsIgnoreCase(m.getType()) || "rating".equalsIgnoreCase(m.getType()))
                        && m.getRating() != null)
                .toList();

        if (feedbacks.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "averageRating", 0,
                    "totalFeedbacks", 0
            ));
        }

        double avg = feedbacks.stream()
                .mapToInt(ContactMessage::getRating)
                .average()
                .orElse(0);

        Map<String, Object> summary = new HashMap<>();
        summary.put("averageRating", Math.round(avg * 10.0) / 10.0);
        summary.put("totalFeedbacks", feedbacks.size());

        return ResponseEntity.ok(summary);
    }

    /** ✅ Ratings Breakdown (shows how many 1★,2★,...5★) */
    @GetMapping("/ratings-breakdown")
    public ResponseEntity<Map<String, Object>> getRatingsBreakdown() {
        Map<Integer, Long> breakdown = new HashMap<>();
        List<ContactMessage> all = repository.findAll(); // fetch once for performance

        for (int i = 1; i <= 5; i++) {
            final int ratingValue = i; // must be effectively final for lambda
            long count = all.stream()
                    .filter(m -> ("feedback".equalsIgnoreCase(m.getType()) || "rating".equalsIgnoreCase(m.getType()))
                            && Objects.equals(m.getRating(), ratingValue))
                    .count();
            breakdown.put(ratingValue, count);
        }

        return ResponseEntity.ok(Map.of("breakdown", breakdown));
    }

    /** ✅ Independent Rating Submission (not tied to feedback or question) */
    @PostMapping("/rating")
    public ResponseEntity<Map<String, Object>> saveRating(@RequestBody Map<String, Object> payload) {
        try {
            ContactMessage rating = new ContactMessage();
            rating.setName((String) payload.get("name"));
            rating.setEmail((String) payload.get("email"));
            rating.setType("rating");
            rating.setMessage("User submitted a rating");

            if (payload.containsKey("stars") && payload.get("stars") != null) {
                rating.setRating(((Number) payload.get("stars")).intValue());
            }

            ContactMessage saved = repository.save(rating);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rating submitted successfully!");
            response.put("data", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to submit rating.");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /** ✅ Reply to a client message (includes original question/feedback in email) */
    @PostMapping("/reply/{id}")
    public ResponseEntity<Map<String, Object>> replyToClient(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Optional<ContactMessage> optionalMessage = repository.findById(id);
        if (optionalMessage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Message not found"));
        }

        ContactMessage message = optionalMessage.get();
        String responseMessage = body.get("responseMessage");

        // Optional: send email reply including user's original message
        if (emailService != null) {
            try {
                String originalMsg = message.getMessage() != null ? message.getMessage() : "No message available.";

                String emailBody = String.format(
                        "Hello %s,\n\n" +
                        "Thank you for contacting WoodMoon Enterprises.\n\n" +
                        "📝 Your original message:\n\"%s\"\n\n" +
                        "💬 Our reply:\n%s\n\n" +
                        "Kind regards,\nWoodMoon Support Team\n\n" +
                        "— This is an automated email from WoodMoon Contact System —",
                        message.getName() != null ? message.getName() : "Valued Customer",
                        originalMsg,
                        responseMessage
                );

                emailService.sendEmail(message.getEmail(), "Response to your message", emailBody);

            } catch (Exception e) {
                System.err.println("Email sending failed: " + e.getMessage());
            }
        }

        message.setReplied(true);
        message.setResponseMessage(responseMessage);
        repository.save(message);

        return ResponseEntity.ok(Map.of(
                "message", "Reply sent successfully!",
                "data", message
        ));
    }

    /** ✅ Delete a message */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Message not found"));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Message deleted successfully"));
    }

    /** ✅ Toggle highlight (star) */
    @PatchMapping("/star/{id}")
    public ResponseEntity<Map<String, Object>> toggleStar(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {

        Optional<ContactMessage> optionalMessage = repository.findById(id);
        if (optionalMessage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Message not found"));
        }

        ContactMessage message = optionalMessage.get();
        Boolean starred = body.get("starred");
        message.setStarred(starred != null ? starred : false);
        repository.save(message);

        return ResponseEntity.ok(Map.of(
                "message", "Starred status updated successfully!",
                "data", message
        ));
    }

    /** ✅ Simple health check */
    @GetMapping("/test")
    public String test() {
        return "ContactController is working ✅";
    }
}

