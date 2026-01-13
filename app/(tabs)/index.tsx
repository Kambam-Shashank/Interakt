import { useSession } from '@/constants/AuthContext';
import { sendWhatsAppConfirmation, TEMPLATES } from '@/utils/interaktService';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    const { signOut, userParams } = useSession();
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleAction = async (actionType: 'BUY' | 'TRANSFER' | 'DELIVERY' | 'COPY_OF_BOOKED_FOR' | 'PAYMENT_VAULT') => {
        const phoneNumber = userParams?.phoneNumber;
        if (!phoneNumber) {
            Alert.alert("Error", "User phone number not found. Please login again.");
            return;
        }

        let templateName = '';
        let successMessage = '';
        let bodyValues: string[] = [];

        switch (actionType) {
            case 'BUY':
                templateName = TEMPLATES.BUY_GOLD;
                successMessage = 'Buy Gold request initiated! Check WhatsApp.';
                bodyValues = ['User', '#123456', '12-Jan-2025', 'Gold 24K', '1g', '₹7500', '₹7500'];
                break;
            case 'TRANSFER':
                templateName = TEMPLATES.TRANSFER_GOLD;
                successMessage = 'Transfer request initiated! Check WhatsApp.';
                bodyValues = ['User', '1g', 'Recipient Name', '#TXN789'];
                break;
            case 'DELIVERY':
                templateName = TEMPLATES.DELIVERY_GOLD;
                successMessage = 'Delivery request initiated! Check WhatsApp.';
                bodyValues = ['User', '#ORD456', '15-Jan-2025'];
                break;
            case 'COPY_OF_BOOKED_FOR':
                templateName = TEMPLATES.COPY_OF_BOOKED_FOR;
                successMessage = 'Copy of booked for request initiated! Check WhatsApp.';
                bodyValues = ['User', '#ORD456', '12-Jan-2025', 'Gold 24K', '1g', '₹7500', '₹7500', 'Confirmed'];
                break;
            case 'PAYMENT_VAULT':
                templateName = TEMPLATES.PAYMENT_VAULT;
                successMessage = 'Payment vault request initiated! Check WhatsApp.';
                bodyValues = ['User', '#ORD456'];
                break;
        }

        setLoading(actionType);
        try {
            await sendWhatsAppConfirmation(phoneNumber, templateName, bodyValues);
            Alert.alert("Success", successMessage);
        } catch (error: any) {
            Alert.alert("Failed", "Could not send WhatsApp message. " + error.message);
        } finally {
            setLoading(null);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>Select an action below to proceed with your Gold transaction.</Text>
            </View>

            <View style={styles.buttonContainer}>
                <ActionButton
                    title="Buy Gold"
                    subtitle="Purchase 24K Pure Gold"
                    iconName="cart"
                    loading={loading === 'BUY'}
                    onPress={() => handleAction('BUY')}
                    color="#FFD700"
                    textColor="#000"
                />
                <ActionButton
                    title="Transfer Gold"
                    subtitle="Send gold to another user"
                    iconName="swap-horizontal"
                    loading={loading === 'TRANSFER'}
                    onPress={() => handleAction('TRANSFER')}
                    color="#4CAF50"
                    textColor="#FFF"
                />
                <ActionButton
                    title="Delivery Gold"
                    subtitle="Home delivery service"
                    iconName="cube"
                    loading={loading === 'DELIVERY'}
                    onPress={() => handleAction('DELIVERY')}
                    color="#2196F3"
                    textColor="#FFF"
                />
                <ActionButton
                    title="Booking History"
                    subtitle="View your past bookings"
                    iconName="list"
                    loading={loading === 'COPY_OF_BOOKED_FOR'}
                    onPress={() => handleAction('COPY_OF_BOOKED_FOR')}
                    color="#A020F0"
                    textColor="#FFF"
                />
                <ActionButton
                    title="Payment Vault"
                    subtitle="Secure payment recordings"
                    iconName="wallet"
                    loading={loading === 'PAYMENT_VAULT'}
                    onPress={() => handleAction('PAYMENT_VAULT')}
                    color="#FF4500"
                    textColor="#FFF"
                />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

function ActionButton({ title, subtitle, iconName, onPress, color, textColor, loading }: any) {
    return (
        <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: color || '#333' }]}
            onPress={onPress}
            disabled={loading}
        >
            <Ionicons name={iconName} size={32} color={textColor} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
                <Text style={[styles.buttonTitle, { color: textColor }]}>{title}</Text>
                <Text style={[styles.buttonSubtitle, { color: textColor }]}>{subtitle}</Text>
            </View>
            {loading && <ActivityIndicator color={textColor} />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#CCC',
    },
    buttonContainer: {
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSubtitle: {
        fontSize: 12,
        opacity: 0.8,
    },
    logoutButton: {
        marginTop: 40,
        alignItems: 'center',
        padding: 16,
    },
    logoutText: {
        color: '#FF6B6B',
        fontSize: 16,
    }
});
