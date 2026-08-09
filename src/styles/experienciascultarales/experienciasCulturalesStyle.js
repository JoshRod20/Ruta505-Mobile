import { StyleSheet } from "react-native";

export const experienciasCulturalesStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2b2b2b",
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: "#6f6256",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  input: {
    backgroundColor: "#f8f3ea",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2b2b2b",
    marginBottom: 12,
  },
  textarea: {
    backgroundColor: "#f8f3ea",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2b2b2b",
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#e6d8c5",
    backgroundColor: "#fffaf2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  categoryChipActive: {
    backgroundColor: "#ef8a17",
    borderColor: "#ef8a17",
  },
  categoryChipText: {
    fontSize: 12,
    color: "#6f6256",
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },
  primaryButton: {
    marginTop: 6,
    backgroundColor: "#1d7a6f",
    borderRadius: 16,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  feedbackBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  feedbackText: {
    fontSize: 16,
    color: "#2b2b2b",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 13,
    color: "#b42318",
    marginBottom: 12,
    lineHeight: 18,
  },
});