import { useSession } from '@/constants/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirm, setConfirm] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { signIn, updateUserParams } = useSession();
    const router = useRouter();


    const handleSendOTP = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }
        setLoading(true);
        try {
            setTimeout(() => {
                setConfirm(true); 
                setLoading(false);
                Alert.alert('OTP Sent', 'Please enter code 123456 for testing.');
            }, 1500);
        } catch (error: any) {
            setLoading(false);
            Alert.alert('Error', error.message);
        }
    };

    const handleVerifyOTP = async () => {
        if (!verificationCode) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }
        setLoading(true);
        try {
            if (verificationCode === '123456') {
                updateUserParams({ phoneNumber });
                signIn('mock-session-token');
                router.replace('/(tabs)');
            } else {
                Alert.alert('Error', 'Invalid Code');
            }
        } catch (error: any) {
            Alert.alert('Error', 'Invalid Code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Login or Signup with your mobile number</Text>

                {!confirm ? (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+91 98765 43210"
                                placeholderTextColor="#666"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSendOTP}
                            disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>Send OTP</Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Verification Code</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="123456"
                                placeholderTextColor="#666"
                                keyboardType="number-pad"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleVerifyOTP}
                            disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>Verify & Login</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setConfirm(null)}>
                            <Text style={styles.backButtonText}>Wrong number?</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', 
        justifyContent: 'center',
        padding: 20,
    },
    contentContainer: {
        padding: 24,
        borderRadius: 16,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        color: '#AAA',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#222',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFF',
    },
    button: {
        height: 50,
        backgroundColor: '#FFD700', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    backButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#666',
        fontSize: 14,
    }
});
